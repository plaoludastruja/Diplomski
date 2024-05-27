import { getDocs, query, collection, orderBy, getDoc, doc, addDoc, QueryDocumentSnapshot, serverTimestamp, where } from "firebase/firestore/lite";
import { DatabaseCollection, FoodRecipes } from "../model/model";
import { db, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getCurrentUser } from "./UserService";

export async function GetAllFoodRecipes() {
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), orderBy('createdAt', "desc")));
    const foodRecipesData = data.docs.map(doc => (doc.data()));
    return foodRecipesData;
}

export async function GetFoodRecipe(id: string): Promise<FoodRecipes> {
    let foodRecipeItem: FoodRecipes = {
        id: "",
        title: "",
        author: "",
        servingSize: "",
        ingredients: [],
        steps: [],
        images: [],
        createdAt: "",
    }
    const data = await getDoc(doc(db, DatabaseCollection.recipes, id).withConverter(foodRecipesConverter));
    if (data.exists()) {
        foodRecipeItem = data.data();
        console.log("Document data:", foodRecipeItem);
    }
    return foodRecipeItem;
}

export function AddFoodRecipe(newRecipe: Partial<FoodRecipes>) {
    //return getDocs(query(collection(db, 'DatabaseCollection.recipes'), orderBy('createdAt', "desc")));
    addDoc(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), newRecipe);
}

/*export function EditFoodRecipe(id:string) {
    //return getDocs(query(collection(db, DatabaseCollection.recipes), orderBy('createdAt', "desc")));
    setDoc(doc(db, DatabaseCollection.recipes, id), {
        name: "Los NJUJORKdas",
        state: "CA",
        country: "USA"
    });
}*/

export async function GetMyFoodRecipes() {
    const user = await getCurrentUser()
    if(!user) return [];
    console.log(user.id)
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), where("author", "==", user.id)));
    const foodRecipesData = data.docs.map(doc => (doc.data()));
    return foodRecipesData;
}

export async function UploadFoodRecipesImages(selectedImages: string[], folder: string): Promise<string[]> {
    const urls = [];
    for (var selectedImage of selectedImages) {
        const url = await uploadImage(selectedImage, folder);
        urls.push(url);
    }
    return urls;
}

async function uploadImage(selectedImage: string, folder: string): Promise<string> {
    const imageName = generateUniqueName();
    const imageRef = ref(storage, `${folder}/${imageName}`);
    const blob: Blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function () {
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', selectedImage, true);
        xhr.send(null);
    })

    await uploadBytes(imageRef, blob);
    const url = await getDownloadURL(imageRef)
    console.log('Image uploaded: ', url);

    return url;
}

// Firestore data converter
export const foodRecipesConverter = {
    toFirestore: (foodRecipes: FoodRecipes) => {
        return {
            title: foodRecipes.title,
            author: foodRecipes.author,
            servingSize: foodRecipes.servingSize,
            ingredients: foodRecipes.ingredients,
            steps: foodRecipes.steps,
            images: foodRecipes.images || null,
            createdAt: serverTimestamp()
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data() as FoodRecipes;
        return { ...data, id: snapshot.id };
    }
};

function generateUniqueName() {
    throw new Error("Function not implemented.");
}
