import { QueryDocumentSnapshot, doc, getDoc, setDoc, updateDoc } from "firebase/firestore/lite"
import { DatabaseCollection, Fridge, Ingredient } from "../model/model"
import { getCurrentUser } from "./AuthService"
import { db } from "./firebase"

async function GetFridge() {
    const user = await getCurrentUser()
    if(!user){
        return
    }
    let fridge: Fridge = {
        id: "",
        ingredients: [],
    }
    const data = await getDoc(doc(db, DatabaseCollection.fridges, user.id).withConverter(fridgeConverter))
    console.log('Data fetched at GetFridge()')
    if (data.exists()) {
        fridge = data.data()
    }
    return fridge
}

function AddFridge(id: string) {
    const fridge: Fridge = {
        id: id,
        ingredients: [] 
    }
    setDoc(doc(db, DatabaseCollection.fridges, id).withConverter(fridgeConverter), fridge)
    console.log('Data added at AddFridge()')
}

async function AddToMyFridge(ingredients: Ingredient[]) {
    const user = await getCurrentUser()
    updateDoc(doc(db, DatabaseCollection.fridges, user.id), {
        ingredients: ingredients
    })
    console.log('Data updated at AddToMyFridge()')
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
    GetFridge,
    AddFridge,
    AddToMyFridge,
}