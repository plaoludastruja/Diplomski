import { QueryDocumentSnapshot, arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore/lite"
import { GetCurrentUser } from "./AuthService"
import { Bookmark, DatabaseCollection } from "../model/model"
import { db } from "./firebase"


function AddBookmark(id: string) {
    const bookmark: Bookmark = {
        id: id,
        savedFoodRecipesIds: []
    }
    setDoc(doc(db, DatabaseCollection.bookmarks, id).withConverter(bookmarkConverter), bookmark)
}

async function GetMySavedFoodRecipes() {
    const user = await GetCurrentUser()
    if (!user) return []
    let bookmark: Bookmark = {
        id: user.id,
        savedFoodRecipesIds: []
    }
    const data = await getDoc(doc(db, DatabaseCollection.bookmarks, user.id).withConverter(bookmarkConverter))
    if (data.exists()) {
        bookmark = data.data()
    }
    if (bookmark.savedFoodRecipesIds.length === 0) {
        return []
    }
    const recipePromises = bookmark.savedFoodRecipesIds.map(id => getDoc(doc(db, DatabaseCollection.recipes, id)))
    const recipeSnapshots = await Promise.all(recipePromises)
    return recipeSnapshots.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data()
    }))
}

async function AddToMyBookmark(newSavedFoodRecipesId: string) {
    const user = await GetCurrentUser()
    if (!user) return
    updateDoc(doc(db, DatabaseCollection.bookmarks, user.id), {
        savedFoodRecipesIds: arrayUnion(newSavedFoodRecipesId)
    })
}

async function RemoveFromMyBookmark(newSavedFoodRecipesId: string) {
    const user = await GetCurrentUser()
    if (!user) return
    updateDoc(doc(db, DatabaseCollection.bookmarks, user.id), {
        savedFoodRecipesIds: arrayRemove(newSavedFoodRecipesId)
    })
}

async function IsRecipeBookmarked(foodRecipesId: string) {
    const user = await GetCurrentUser()
    if (!user) return false
    let bookmark: Bookmark = {
        id: '',
        savedFoodRecipesIds: []
    }
    const data = await getDoc(doc(db, DatabaseCollection.bookmarks, user.id).withConverter(bookmarkConverter))
    if (data.exists()) {
        bookmark = data.data()
    }
    return bookmark.savedFoodRecipesIds.includes(foodRecipesId)
}

const bookmarkConverter = {
    toFirestore: (bookmark: Bookmark) => {
        return {
            savedFoodRecipesIds: bookmark.savedFoodRecipesIds
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data() as Bookmark
        return { ...data, id: snapshot.id }
    }
}

export {
    AddBookmark,
    GetMySavedFoodRecipes,
    AddToMyBookmark,
    RemoveFromMyBookmark,
    IsRecipeBookmarked,
}
