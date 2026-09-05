import { getDocs, query, collection, orderBy, getDoc, doc, addDoc, QueryDocumentSnapshot, QueryConstraint, serverTimestamp, where, updateDoc, increment, limit, startAfter, deleteDoc } from "firebase/firestore/lite"
import { DatabaseCollection, FoodRecipes } from "../model/model"
import { db } from "./firebase"
import { GetCurrentUser } from "./AuthService"
import 'react-native-get-random-values'

async function GetAllFoodRecipes(lastVisible: QueryDocumentSnapshot | undefined) {
    const constraints: QueryConstraint[] = [orderBy('createdAt', "desc"), limit(15)]
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
    const constraints: QueryConstraint[] = [where("author", "==", user.id), orderBy('createdAt', "desc"), limit(5)]
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
    AddFoodRecipe,
    EditFoodRecipe,
    DeleteFoodRecipe,
    GetMyFoodRecipes,
    UpdateSavedCount,
    UpdateRecipeRating,
    foodRecipesConverter,
}
