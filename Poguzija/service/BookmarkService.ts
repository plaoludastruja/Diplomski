import { QueryDocumentSnapshot, arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore/lite"
import { GetCurrentUser } from "./AuthService"
import { Bookmark, DatabaseCollection, FoodRecipes } from "../model/model"
import { db } from "./firebase"


function AddBookmark(id: string) {
    const bookmark: Bookmark = {
        id: id,
        savedFoodRecipesIds: []
    }
    setDoc(doc(db, DatabaseCollection.bookmarks, id).withConverter(bookmarkConverter), bookmark)
}

async function GetMySavedFoodRecipes(lastIndex: number = 0): Promise<{foodRecipesData: FoodRecipes[], newLastIndex: number}> {
    const user = await GetCurrentUser()
    if (!user) return { foodRecipesData: [], newLastIndex: -1 }
    let bookmark: Bookmark = {
        id: user.id,
        savedFoodRecipesIds: []
    }
    const data = await getDoc(doc(db, DatabaseCollection.bookmarks, user.id).withConverter(bookmarkConverter))
    if (data.exists()) {
        bookmark = data.data()
    }
    if (bookmark.savedFoodRecipesIds.length === 0) {
        return { foodRecipesData: [], newLastIndex: -1 }
    }
    const batchSize = 5
    const nextBatchIds = bookmark.savedFoodRecipesIds.slice(lastIndex, lastIndex + batchSize)
    if (nextBatchIds.length === 0) {
        return { foodRecipesData: [], newLastIndex: -1 }
    }
    const recipePromises = nextBatchIds.map(id => getDoc(doc(db, DatabaseCollection.recipes, id)))
    const recipeSnapshots = await Promise.all(recipePromises)
    const foodRecipesData = recipeSnapshots
        .filter(doc => doc.exists()).
            map(docE =>  ({
                id: docE.id,
                ...docE.data()
            } as FoodRecipes))
    const newLastIndex = lastIndex + batchSize < bookmark.savedFoodRecipesIds.length ? lastIndex + batchSize : -1
    return { foodRecipesData, newLastIndex }
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

async function IsRecipeBookmarked(foodRecipesId: string): Promise<boolean> {
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
