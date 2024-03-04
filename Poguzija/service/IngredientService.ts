import { getDocs, query, collection, orderBy } from "firebase/firestore/lite";
import { DatabaseCollection } from "../model/model";
import { db } from "./firebase";

async function GetIngredients() {
    const data = await getDocs(query(collection(db, DatabaseCollection.ingredients), orderBy('name', "asc")));
    const ingredients = data.docs.map(doc => {
        return { id: doc.id, name: doc.data().name }
    });
    return ingredients;
}

async function GetUnits() {
    const data = await getDocs(query(collection(db, DatabaseCollection.units), orderBy('name', "asc")));
    const units = data.docs.map(doc => {
        return { id: doc.id, name: doc.data().name }
    });
    return units;
}

export {
    GetIngredients,
    GetUnits
}