import { QueryDocumentSnapshot, collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore/lite"
import { getCurrentUser } from "./UserService"
import { Bookmark, DatabaseCollection } from "../model/model"
import { foodRecipesConverter } from "./RecipesService"
import { db } from "./firebase"

async function GetMySavedFoodRecipes() {
    const user = await getCurrentUser()
    if(!user) return []
    let bookmark: Bookmark = {
        id: '',
        user: '',
        savedFoodRecipesIds: [] 
    }
    const data = await getDoc(doc(db, DatabaseCollection.bookmarks, user.aditionalUserData.bookmarkId).withConverter(bookmarkConverter))
    console.log('Data fetched at GetMySavedFoodRecipes()')
    console.log(data)
    if (data.exists()) {
        bookmark = data.data()
    }
    console.log(bookmark.savedFoodRecipesIds)
    if (bookmark.savedFoodRecipesIds.length === 0) {
        return []
    }
    // Fetch each document by ID (this could be optimized if Firestore supported IN queries)
    const recipePromises = bookmark.savedFoodRecipesIds.map(id => getDoc(doc(db, DatabaseCollection.recipes, id)))
    const recipeSnapshots = await Promise.all(recipePromises)
    console.log(recipeSnapshots)
    return recipeSnapshots.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
    }))
}

function AddBookmark(id: string, user: string) {
    const bookmark: Bookmark = {
        id: id,
        user: user,
        savedFoodRecipesIds: [] 
    }
    setDoc(doc(db, DatabaseCollection.bookmarks, id).withConverter(bookmarkConverter), bookmark)
    console.log('Data added at AddBookmark()')
}

const bookmarkConverter = {
    toFirestore: (bookmark: Bookmark) => {
        return {
            user: bookmark.user,
            savedFoodRecipesIds: bookmark.savedFoodRecipesIds
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data() as Bookmark
        return { ...data, id: snapshot.id }
    }
}

export {
    GetMySavedFoodRecipes,
    AddBookmark
}