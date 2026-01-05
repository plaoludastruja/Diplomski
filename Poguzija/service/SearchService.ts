import { QueryDocumentSnapshot, collection, getDocs, limit, query, startAfter, where } from "firebase/firestore/lite"
import { DatabaseCollection, FoodRecipes } from "../model/model"
import { db } from "./firebase"
import { foodRecipesConverter } from "./RecipesService"

async function GetSearchResults(searchParams: string[], lastVisible: QueryDocumentSnapshot | null) {
    let foodRecipesData: FoodRecipes[] = []
    const searchParamsData = searchParams.map(searchParam => searchParam.toUpperCase())
    const searchPromises = searchParamsData.map(searchParam => {
        let q = query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), where('searchFields', 'array-contains', searchParam), limit(5))
        if (lastVisible) {
            q = query(q, startAfter(lastVisible))
        }
        return getDocs(q)
    })
    
    const searchSnapshot = await Promise.all(searchPromises)
    const allResults  = searchSnapshot.flatMap(snapshot => snapshot.docs.map(doc => doc.data()))
    const filteredResults = allResults.filter(doc => 
        searchParamsData.every(searchParam => doc.searchFields.includes(searchParam))
    )
    foodRecipesData = filteredResults.filter((result, index, self) => 
        index === self.findIndex(r => r.id === result.id)
    )
    const newLastVisible = searchSnapshot.flatMap(snapshot => snapshot.docs).slice(-1)[0] || null

    return { foodRecipesData, newLastVisible }
}

export {
    GetSearchResults,
}