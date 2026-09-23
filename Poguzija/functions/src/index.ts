import { initializeApp } from "firebase-admin/app"
import { FieldValue, Query, WriteResult, getFirestore } from "firebase-admin/firestore"
import { getStorage } from "firebase-admin/storage"
import { onDocumentDeleted, onDocumentUpdated } from "firebase-functions/v2/firestore"
import { HttpsError, onCall } from "firebase-functions/v2/https"
import * as functionsV1 from "firebase-functions/v1"
import { logger } from "firebase-functions"
import { ImageAnnotatorClient } from "@google-cloud/vision"

initializeApp()

const visionClient = new ImageAnnotatorClient()

interface RecipesByDay {
    day: string
    recipes: string[]
}

interface FoodRecipeData {
    author?: string
    images?: string[] | null
}

function extractStoragePath(downloadUrl: string): string | null {
    const match = downloadUrl.match(/\/o\/(.+?)\?/)
    return match ? decodeURIComponent(match[1]) : null
}

async function deleteImages(images: string[]) {
    const bucket = getStorage().bucket()
    await Promise.all(images.map(async (url) => {
        const path = extractStoragePath(url)
        if (!path) return
        try {
            await bucket.file(path).delete()
        } catch (error) {
            logger.warn(`Failed to delete storage file ${path}`, error)
        }
    }))
}

async function deleteCollection(query: Query) {
    const snap = await query.get()
    await Promise.all(snap.docs.map((doc) => doc.ref.delete()))
}

async function removeFromBookmarks(recipeId: string) {
    const db = getFirestore()
    const bookmarksSnap = await db.collection("bookmarks")
        .where("savedFoodRecipesIds", "array-contains", recipeId)
        .get()

    await Promise.all(bookmarksSnap.docs.map((doc) =>
        doc.ref.update({
            savedFoodRecipesIds: FieldValue.arrayRemove(recipeId)
        })
    ))
}

async function removeFromSchedulers(recipeId: string) {
    const db = getFirestore()
    const schedulersSnap = await db.collection("recipeSchedulers").get()

    const writes = schedulersSnap.docs.reduce<Promise<WriteResult>[]>((acc, doc) => {
        const recipeByDay = doc.data().recipeByDay as RecipesByDay[] | undefined
        if (!recipeByDay?.some((day) => day.recipes?.includes(recipeId))) return acc

        const updatedRecipeByDay = recipeByDay.map((day) => ({
            ...day,
            recipes: day.recipes.filter((id) => id !== recipeId)
        }))
        acc.push(doc.ref.update({ recipeByDay: updatedRecipeByDay }))
        return acc
    }, [])

    await Promise.all(writes)
}

// Fires whenever a recipe document is deleted, regardless of how (app, account
// deletion, console) - keeps bookmarks, schedulers, comments and images in sync.
export const cleanupDeletedRecipe = onDocumentDeleted("foodRecipes/{recipeId}", async (event) => {
    const recipeId = event.params.recipeId
    const recipeData = event.data?.data() as FoodRecipeData | undefined
    const db = getFirestore()

    await Promise.all([
        removeFromBookmarks(recipeId),
        removeFromSchedulers(recipeId),
        deleteCollection(db.collection(`foodRecipes/${recipeId}/comments`)),
        recipeData?.images?.length ? deleteImages(recipeData.images) : Promise.resolve(),
    ])
})

// Fires whenever a recipe document is edited. Deletes any images that were
// removed from the images array (edit-flow image removal), since that's just
// a field update and cleanupDeletedRecipe never sees it.
export const cleanupUpdatedRecipeImages = onDocumentUpdated("foodRecipes/{recipeId}", async (event) => {
    const before = event.data?.before.data() as FoodRecipeData | undefined
    const after = event.data?.after.data() as FoodRecipeData | undefined

    const beforeImages = before?.images ?? []
    const afterImages = new Set(after?.images ?? [])
    const removedImages = beforeImages.filter((url) => !afterImages.has(url))

    if (removedImages.length) {
        await deleteImages(removedImages)
    }
})

// Fires whenever a Firebase Auth account is deleted. Deleting the user's own
// recipes here lets cleanupDeletedRecipe (above) handle each recipe's own
// comments/images/bookmarks/scheduler references automatically.
export const cleanupDeletedUser = functionsV1.auth.user().onDelete(async (user) => {
    const uid = user.uid
    const db = getFirestore()

    const recipesSnap = await db.collection("foodRecipes").where("author", "==", uid).get()
    await Promise.all(recipesSnap.docs.map((doc) => doc.ref.delete()))

    const ownCommentsSnap = await db.collectionGroup("comments").where("authorId", "==", uid).get()
    await Promise.all(ownCommentsSnap.docs.map((doc) => doc.ref.delete()))

    await Promise.all([
        db.doc(`users/${uid}`).delete(),
        db.doc(`fridges/${uid}`).delete(),
        db.doc(`bookmarks/${uid}`).delete(),
        db.doc(`recipeSchedulers/${uid}`).delete(),
    ])
})

// Keywords matched (case-insensitive, substring) against Cloud Vision label
// descriptions to decide whether a photo counts as food-related.
const FOOD_LABEL_KEYWORDS = [
    "food", "dish", "meal", "cuisine", "recipe", "ingredient", "produce",
    "fruit", "vegetable", "meat", "fish", "seafood", "dairy", "cheese",
    "bread", "pastry", "pasta", "dessert", "baked goods", "snack",
    "beverage", "drink", "cooking", "baking", "grilling", "kitchenware",
    "tableware", "natural foods", "comfort food", "fast food",
    "spice", "seasoning", "herb", "condiment", "masala", "curry",
    "powder", "flavoring", "seed", "grain", "legume", "nut", "sauce",
    "poultry", "chicken", "turkey", "pork", "beef", "steak", "sausage",
    "bacon", "ham", "mushroom", "egg", "milk", "yogurt", "cream", "butter",
    "oil", "rice", "cereal", "flour", "noodle", "dough", "batter",
    "candy", "chocolate", "confectionery", "sugar", "syrup", "honey",
    "sweetener", "juice", "tea", "coffee", "wine", "beer", "smoothie",
    "cocktail", "soup", "stew", "salad", "sandwich", "pizza", "burger",
    "stir fry", "casserole", "appetizer", "side dish", "main course",
    "superfood", "whole food", "health food", "organic food",
    "vegetarian food", "vegan food", "garnish", "dressing", "broth",
    "pickle", "fermented food", "cake", "kitchen", "plate", "bowl",
    "oven", "stove", "stovetop", "kettle", "mixer", "blender", "toaster",
    "microwave", "cookware", "saucepan", "frying pan", "whisk", "cutlery",
    "kitchen utensil", "pot", "pan", "baking sheet", "baking pan",
    "bay leaf", "laurel", "basil", "parsley", "cilantro", "dill",
]

const UNSAFE_LIKELIHOODS = ["LIKELY", "VERY_LIKELY"]
const RACY_UNSAFE_LIKELIHOODS = ["VERY_LIKELY"]

interface CheckImageContentResult {
    approved: boolean
    reason?: "not_food" | "unsafe"
}

// Callable from the client before a picked photo is attached to a recipe.
// Runs Cloud Vision's label detection (is this food?) and
// SafeSearch detection (is this inappropriate?) in a single request.
export const checkImageContent = onCall<{ imageBase64?: string }, Promise<CheckImageContentResult>>(async (request) => {
    const imageBase64 = request.data.imageBase64
    if (!imageBase64) {
        throw new HttpsError("invalid-argument", "Missing imageBase64")
    }

    const [result] = await visionClient.annotateImage({
        image: { content: imageBase64 },
        features: [
            { type: "LABEL_DETECTION", maxResults: 20 },
            { type: "SAFE_SEARCH_DETECTION" },
        ],
    })

    const safeSearch = result.safeSearchAnnotation
    const labels = (result.labelAnnotations ?? []).map((label) => ({
        description: label.description ?? "",
        score: label.score ?? 0,
    }))

    logger.info("checkImageContent: Vision API result", {
        labels,
        safeSearch: {
            adult: safeSearch?.adult,
            racy: safeSearch?.racy,
            violence: safeSearch?.violence,
            medical: safeSearch?.medical,
            spoof: safeSearch?.spoof,
        },
    })

    const isUnsafe = UNSAFE_LIKELIHOODS.includes(String(safeSearch?.adult ?? ""))
        || RACY_UNSAFE_LIKELIHOODS.includes(String(safeSearch?.racy ?? ""))
        || UNSAFE_LIKELIHOODS.includes(String(safeSearch?.violence ?? ""))

    if (isUnsafe) {
        logger.info("checkImageContent: rejected (unsafe)")
        return { approved: false, reason: "unsafe" }
    }

    const lowerLabels = labels.map((label) => label.description.toLowerCase())
    const isFood = lowerLabels.some((label) => FOOD_LABEL_KEYWORDS.some((keyword) => label.includes(keyword)))

    if (!isFood) {
        logger.info("checkImageContent: rejected (not food)")
        return { approved: false, reason: "not_food" }
    }

    logger.info("checkImageContent: approved")
    return { approved: true }
})
