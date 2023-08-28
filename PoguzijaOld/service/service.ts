import { QueryDocumentSnapshot, addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore/lite";
import { db } from "./firebase";
import { FoodRecipes } from "../model/model";

export async function GetAllFoodRecipes() {
    const data = await getDocs(query(collection(db, 'foodRecipes').withConverter(foodRecipesConverter), orderBy('createdAt', "desc")));
    const foodRecipesData = data.docs.map(doc => (doc.data()));
    return foodRecipesData;
}

export function AddFoodRecipe(newRecipe: Partial<FoodRecipes>) {
    //return getDocs(query(collection(db, 'foodRecipes'), orderBy('createdAt', "desc")));
    addDoc(collection(db, "foodRecipes").withConverter(foodRecipesConverter), newRecipe);
}

// Firestore data converter
const foodRecipesConverter = {
    toFirestore: (foodRecipes : FoodRecipes) => {
        return {
            title: foodRecipes.title,
            steps: foodRecipes.steps,
            author: foodRecipes.author,
            image: foodRecipes.image || null,
            createdAt: serverTimestamp()
            };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data() as FoodRecipes;
        return { id: snapshot.id, ...data };    
    }
};

/*export function EditFoodRecipe(id:string) {
    //return getDocs(query(collection(db, 'foodRecipes'), orderBy('createdAt', "desc")));
    setDoc(doc(db, "foodRecipes", id), {
        name: "Los NJUJORKdas",
        state: "CA",
        country: "USA"
    });
}*/