import { QueryDocumentSnapshot, QueryConstraint, collection, getDocs, limit, query, startAfter, where } from "firebase/firestore/lite"
import { DatabaseCollection } from "../model/model"
import { db } from "./firebase"
import { foodRecipesConverter } from "./RecipesService"
import { RESULT_LIMIT } from "../constants/Firestore"

const MAX_SEARCH_TERMS = 10

async function GetSearchResults(searchParams: string[], lastVisible: QueryDocumentSnapshot | null | undefined) {
    const searchParamsData = searchParams.map(searchParam => searchParam.toUpperCase()).slice(0, MAX_SEARCH_TERMS)

    const constraints: QueryConstraint[] = [where('searchFields', 'array-contains-any', searchParamsData), limit(RESULT_LIMIT)]
    if (lastVisible) {
        constraints.push(startAfter(lastVisible))
    }
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), ...constraints))

    const foodRecipesData = data.docs.map(doc => doc.data())
    const newLastVisible = data.docs[data.docs.length - 1] || null

    return { foodRecipesData, newLastVisible }
}

export {
    GetSearchResults,
}
