import { getDocs, query, collection, orderBy, getDoc, doc, addDoc, QueryDocumentSnapshot, serverTimestamp, where, updateDoc, increment } from "firebase/firestore/lite"
import { DatabaseCollection, FoodRecipes } from "../model/model"
import { db, storage } from "./firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { getCurrentUser } from "./UserService"
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

async function GetAllFoodRecipes() {
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), orderBy('createdAt', "desc")))
    console.log('Data fetched at GetAllFoodRecipes()')
    const foodRecipesData = data.docs.map(doc => (doc.data()))
    return foodRecipesData
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
        createdAt: "",
    }
    const data = await getDoc(doc(db, DatabaseCollection.recipes, id).withConverter(foodRecipesConverter))
    console.log('Data fetched at GetFoodRecipe()')
    if (data.exists()) {
        foodRecipeItem = data.data()
    }
    return foodRecipeItem
}

function AddFoodRecipe(newRecipe: Partial<FoodRecipes>) {
    addDoc(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), newRecipe)
    console.log('Data added at AddFoodRecipe()')
}

async function GetMyFoodRecipes() {
    const user = await getCurrentUser()
    if(!user) return []
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), where("author", "==", user.id), orderBy('createdAt', "desc")))
    console.log('Data fetched at GetMyFoodRecipes()')
    const foodRecipesData = data.docs.map(doc => (doc.data()))
    return foodRecipesData
}

async function UpdateSavedCount(id: string, toIncrease: boolean){
    const incrementValue = toIncrease ? 1 : -1
    updateDoc(doc(db, DatabaseCollection.recipes, id), {
        savedCount: increment(incrementValue)
    })
    console.log('Data updated at UpdateSavedCount()')
}

async function UpdateRecipeRating(id: string, rating: number){
    updateDoc(doc(db, DatabaseCollection.recipes, id), {
        'rating.sum': increment(rating),
        'rating.count': increment(1)
    })
    console.log('Data updated at UpdateRecipeRating()')
}

async function UploadFoodRecipesImages(selectedImages: string[], folder: string): Promise<string[]> {
    const urls = []
    for (var selectedImage of selectedImages) {
        const url = await uploadImage(selectedImage, folder)
        urls.push(url)
    }
    return urls
}

async function uploadImage(selectedImage: string, folder: string): Promise<string> {
    const imageName = generateUniqueName()
    const imageRef = ref(storage, `${folder}/${imageName}`)
    const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = function () {
            resolve(xhr.response)
        }
        xhr.onerror = function () {
            reject(new TypeError('Network request failed'))
        }
        xhr.responseType = 'blob'
        xhr.open('GET', selectedImage, true)
        xhr.send(null)
    })
    await uploadBytes(imageRef, blob)
    const url = await getDownloadURL(imageRef)
    console.log('Image uploaded at uploadImage()')
    return url
}

function generateUniqueName() {
    const guid = uuidv4()
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    const formattedDate = `${year}${month}${day}_${hours}${minutes}${seconds}`
    const uniqueName = `${guid}_${formattedDate}`
    return uniqueName
}

const foodRecipesConverter = {
    toFirestore: (foodRecipe: FoodRecipes) => {
        const ingredientNames = foodRecipe.ingredients.map(ingredient => ingredient.name.toLowerCase())
        const searchFieldsData = foodRecipe.searchFields.map(searchField => searchField.toLowerCase())
        const searchFields = [...searchFieldsData, ...ingredientNames]
        return {
            title: foodRecipe.title,
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
    foodRecipesConverter,
    UploadFoodRecipesImages,
    UpdateSavedCount,
    UpdateRecipeRating,

}