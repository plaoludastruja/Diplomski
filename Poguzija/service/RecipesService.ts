import { getDocs, query, collection, orderBy, getDoc, doc, addDoc, QueryDocumentSnapshot, serverTimestamp, where, updateDoc, increment, limit, startAfter } from "firebase/firestore/lite"
import { DatabaseCollection, FoodRecipes } from "../model/model"
import { db } from "./firebase"
import { GetCurrentUser } from "./AuthService"
import 'react-native-get-random-values'


async function GetAllFoodRecipes(lastVisible: QueryDocumentSnapshot | null) {
    let data
    if (!lastVisible) {
        data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), orderBy('createdAt', "desc"), limit(5)))
    } else {
        data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), orderBy('createdAt', "desc"), startAfter(lastVisible), limit(5)))
    }
    const foodRecipesData = data.docs.map(doc => (doc.data()))
    const newLastVisible = data.docs[data.docs.length - 1] || null
    return { foodRecipesData, newLastVisible }
}

async function GetFoodRecipe(id: string): Promise<FoodRecipes> {
    let foodRecipeItem: FoodRecipes = {
        id: "",
        title: "",
        author: "",
        servingSize: "",
        ingredients: [],
        steps: [],
        images: [],
        searchFields: [],
        cookingTime: "",
        savedCount: 0,
        rating: {
            sum: 0,
            count: 1
        },
        createdAt: ''
    }
    const data = await getDoc(doc(db, DatabaseCollection.recipes, id).withConverter(foodRecipesConverter))
    if (data.exists()) {
        foodRecipeItem = data.data()
    }
    return foodRecipeItem
}

function AddFoodRecipe(newRecipe: Partial<FoodRecipes>) {
    addDoc(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), newRecipe)
}

async function GetMyFoodRecipes(lastVisible: QueryDocumentSnapshot | null) {
    const user = await GetCurrentUser()
    if (!user) return {}
    let data
    if (!lastVisible) {
        data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), where("author", "==", user.id), orderBy('createdAt', "desc"), limit(5)))
    } else {
        data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), where("author", "==", user.id), orderBy('createdAt', "desc"), startAfter(lastVisible), limit(5)))
    }
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

const foodRecipesConverter = {
    toFirestore: (foodRecipe: FoodRecipes) => {
        const ingredientNames = foodRecipe.ingredients.map(ingredient => ingredient.name.toUpperCase())
        const searchFieldsData = foodRecipe.searchFields.map(categoryField => categoryField.toUpperCase())
        const titleFields = foodRecipe.title.toUpperCase().split(/[\s-\.,!?]/).filter(t => t.length >= 4)
        const titleFieldsData = Array.from(new Set(titleFields))
        const searchFields = [...searchFieldsData, ...ingredientNames, ...titleFieldsData]
        return {
            title: foodRecipe.title,
            description: foodRecipe.description,
            author: foodRecipe.author,
            cookingTime: foodRecipe.cookingTime,
            servingSize: foodRecipe.servingSize,
            ingredients: foodRecipe.ingredients,
            steps: foodRecipe.steps,
            images: foodRecipe.images || null,
            searchFields: searchFields,
            savedCount: foodRecipe.savedCount,
            rating: foodRecipe.rating,
            createdAt: serverTimestamp()
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
    GetMyFoodRecipes,
    UpdateSavedCount,
    UpdateRecipeRating,
    foodRecipesConverter,
}
