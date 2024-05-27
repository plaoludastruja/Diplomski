import { getDocs, query, collection } from "firebase/firestore/lite"
import { DatabaseCollection } from "../model/model"
import { db } from "./firebase"

async function GetIngredients() {
    const data = await getDocs(query(collection(db, DatabaseCollection.ingredients)))
    console.log('Data fetched at GetIngredients()')
    const ingredientsData = data.docs.map(doc => {
        return { ingredients: doc.data().ingredients }
    })[0].ingredients.sort((a, b) => a.name.localeCompare(b.name))
    return ingredientsData
}

async function GetUnits() {
    const data = await getDocs(query(collection(db, DatabaseCollection.units)))
    console.log('Data fetched at GetUnits()')
    const unitsData = data.docs.map(doc => {
        return { units: doc.data().units }
    })[0].units.sort((a, b) => a.name.localeCompare(b.name))
    return unitsData
}

export {
    GetIngredients,
    GetUnits
}