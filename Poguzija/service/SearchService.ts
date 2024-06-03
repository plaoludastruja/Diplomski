import { collection, getDocs, limit, query, where } from "firebase/firestore/lite"
import { DatabaseCollection, FoodRecipes } from "../model/model"
import { db } from "./firebase"
import { foodRecipesConverter } from "./RecipesService"

async function GetSearchResults(searchParams: string[]) {
    let searchResults: FoodRecipes[] = []
    const searchParamsData = searchParams.map(searchParam => searchParam.toLowerCase())
    const searchPromises = searchParamsData.map(searchParam => getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), where('searchFields', 'array-contains', searchParam))))
    const searchSnapshot = await Promise.all(searchPromises)
    searchResults = searchSnapshot.flatMap(snapshot => snapshot.docs.map(doc => doc.data()))
    const uniqueResults = searchResults.filter((result, index, self) => 
        index === self.findIndex(r => r.id === result.id)
    )
    return uniqueResults
}

export {
    GetSearchResults,
}