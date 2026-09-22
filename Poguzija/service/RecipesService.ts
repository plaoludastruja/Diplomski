import { getDocs, query, collection, orderBy, getDoc, doc, addDoc, QueryDocumentSnapshot, QueryConstraint, serverTimestamp, where, updateDoc, increment, limit, startAfter, deleteDoc } from "firebase/firestore/lite"
import { DatabaseCollection, FoodRecipes } from "../model/model"
import { db } from "./firebase"
import { GetCurrentUser } from "./AuthService"
import { RESULT_LIMIT } from "../constants/Firestore"
import 'react-native-get-random-values'

async function GetAllFoodRecipes(lastVisible: QueryDocumentSnapshot | undefined) {
    const constraints: QueryConstraint[] = [orderBy('createdAt', "desc"), limit(RESULT_LIMIT)]
    if (lastVisible) {
        constraints.push(startAfter(lastVisible))
    }
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), ...constraints))
    const foodRecipesData = data.docs.map(doc => (doc.data()))
    const newLastVisible = data.docs[data.docs.length - 1] || null
    return { foodRecipesData, newLastVisible }
}

async function GetFoodRecipe(id: string): Promise<FoodRecipes | null> {
    const data = await getDoc(doc(db, DatabaseCollection.recipes, id).withConverter(foodRecipesConverter))
    return data.exists() ? data.data() : null
}

async function TryGetRandomFoodRecipe(): Promise<FoodRecipes | null> {
    const randomValue = Math.random()
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), where('randomValue', '>=', randomValue), orderBy('randomValue'), limit(1)))
    return data.empty ? null : data.docs[0].data()
}

async function GetRandomFoodRecipe(): Promise<FoodRecipes | null> {
    const firstAttempt = await TryGetRandomFoodRecipe()
    if (firstAttempt) return firstAttempt
    const secondAttempt = await TryGetRandomFoodRecipe()
    if (secondAttempt) return secondAttempt
    const wrapDirection = Math.random() < 0.5 ? 'asc' : 'desc'
    const wrapAround = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), orderBy('randomValue', wrapDirection), limit(1)))
    return wrapAround.empty ? null : wrapAround.docs[0].data()
}

async function GetSuggestedFoodRecipe(ingredientNames: string[]): Promise<FoodRecipes | null> {
    if (ingredientNames.length === 0) return null
    const searchTerms = ingredientNames.map(name => name.toUpperCase()).slice(0, 10)
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), where('searchFields', 'array-contains-any', searchTerms), limit(20)))
    if (data.empty) return null
    const scored = data.docs.map(docSnap => {
        const recipe = docSnap.data()
        const matchCount = searchTerms.filter(term => recipe.searchFields?.includes(term)).length
        return { recipe, matchCount }
    })
    const maxMatch = Math.max(...scored.map(s => s.matchCount))
    const bestMatches = scored.filter(s => s.matchCount === maxMatch)
    const randomIndex = Math.floor(Math.random() * bestMatches.length)
    return bestMatches[randomIndex].recipe
}

async function AddFoodRecipe(newRecipe: FoodRecipes) {
    CreateSearchFields(newRecipe)
    const ref = await addDoc(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), newRecipe)
    return ref.id
}

async function EditFoodRecipe(recipeId: string, newRecipe: FoodRecipes) {
    const user = await GetCurrentUser()
    if (!user) return
    CreateSearchFields(newRecipe)
    await updateDoc(doc(db, DatabaseCollection.recipes, recipeId),{
        title: newRecipe.title,
        description: newRecipe.description,
        cookingTime: newRecipe.cookingTime,
        servingSize: newRecipe.servingSize,
        ingredients: newRecipe.ingredients,
        steps: newRecipe.steps,
        images: newRecipe.images,
        categories: newRecipe.categories,
        searchFields: newRecipe.searchFields,
        updatedAt: serverTimestamp()
    })
}

async function DeleteFoodRecipe(recipeId: string) {
    const user = await GetCurrentUser()
    if (!user) return
    await deleteDoc(doc(db, DatabaseCollection.recipes, recipeId))
}

async function GetMyFoodRecipes(lastVisible: QueryDocumentSnapshot | null | undefined) {
    const user = await GetCurrentUser()
    if (!user) return { foodRecipesData: [] as FoodRecipes[], newLastVisible: null }
    const constraints: QueryConstraint[] = [where("author", "==", user.id), orderBy('createdAt', "desc"), limit(RESULT_LIMIT)]
    if (lastVisible) {
        constraints.push(startAfter(lastVisible))
    }
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), ...constraints))
    const foodRecipesData = data.docs.map(doc => (doc.data()))
    const newLastVisible = data.docs[data.docs.length - 1] || null
    return { foodRecipesData, newLastVisible }
}

async function UpdateSavedCount(id: string, toIncrease: boolean) {
    const user = await GetCurrentUser()
    if (!user) return
    const incrementValue = toIncrease ? 1 : -1
    updateDoc(doc(db, DatabaseCollection.recipes, id), {
        savedCount: increment(incrementValue)
    })
}

async function UpdateRecipeRating(id: string, rating: number) {
    const user = await GetCurrentUser()
    if (!user) return
    updateDoc(doc(db, DatabaseCollection.recipes, id), {
        'rating.sum': increment(rating),
        'rating.count': increment(1)
    })
}

function CreateSearchFields(foodRecipe: FoodRecipes) {
    const searchFieldsData = foodRecipe?.searchFields?.map(categoryField => categoryField.toUpperCase()) ?? []
    const ingredientNames = foodRecipe?.ingredients?.map(ingredient => ingredient.name.toUpperCase()) ?? []
    const titleFields = foodRecipe?.title?.toUpperCase().split(/[\s-\.,!?]/).filter(t => t.length >= 4) ?? []
    const titleFieldsData = Array.from(new Set(titleFields))
    const searchFields = [...searchFieldsData, ...ingredientNames, ...titleFieldsData]
    foodRecipe.searchFields = searchFields
}

const foodRecipesConverter = {
    toFirestore: (foodRecipe: FoodRecipes) => {
        return {
            title: foodRecipe.title,
            description: foodRecipe.description,
            author: foodRecipe.author,
            cookingTime: foodRecipe.cookingTime,
            servingSize: foodRecipe.servingSize,
            ingredients: foodRecipe.ingredients,
            steps: foodRecipe.steps,
            images: foodRecipe.images || null,
            categories: foodRecipe.categories,
            searchFields: foodRecipe.searchFields,
            savedCount: foodRecipe.savedCount,
            rating: foodRecipe.rating,
            randomValue: Math.random(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data() as FoodRecipes
        return { ...data, id: snapshot.id }
    }
}

export {
    GetAllFoodRecipes,
    GetFoodRecipe,
    GetRandomFoodRecipe,
    GetSuggestedFoodRecipe,
    AddFoodRecipe,
    EditFoodRecipe,
    DeleteFoodRecipe,
    GetMyFoodRecipes,
    UpdateSavedCount,
    UpdateRecipeRating,
    foodRecipesConverter,
}
