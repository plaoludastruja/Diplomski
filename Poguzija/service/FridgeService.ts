import { QueryDocumentSnapshot, doc, getDoc, setDoc, updateDoc } from "firebase/firestore/lite"
import { DatabaseCollection, Fridge, Ingredient } from "../model/model"
import { GetCurrentUser } from "./AuthService"
import { db } from "./firebase"


function AddFridge(id: string) {
    const fridge: Fridge = {
        id: id,
        ingredients: []
    }
    setDoc(doc(db, DatabaseCollection.fridges, id).withConverter(fridgeConverter), fridge)
}

async function GetMyFridge() {
    const user = await GetCurrentUser()
    if (!user) return
    let fridge: Fridge = {
        id: user.id,
        ingredients: [],
    }
    const data = await getDoc(doc(db, DatabaseCollection.fridges, user.id).withConverter(fridgeConverter))
    if (data.exists()) {
        fridge = data.data()
    }
    return fridge
}

async function AddToMyFridge(ingredients: Ingredient[]) {
    const user = await GetCurrentUser()
    if (!user) return
    updateDoc(doc(db, DatabaseCollection.fridges, user.id), {
        ingredients: ingredients
    })
}

const fridgeConverter = {
    toFirestore: (fridge: Fridge) => {
        return {
            ingredients: fridge.ingredients
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data() as Fridge
        return { ...data, id: snapshot.id }
    }
}

export {
    AddFridge,
    GetMyFridge,
    AddToMyFridge,
}
