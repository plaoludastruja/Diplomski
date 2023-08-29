import { QueryDocumentSnapshot, addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore/lite";
import { db, storage } from "./firebase";
import { FoodRecipes } from "../model/model";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

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
    toFirestore: (foodRecipes: FoodRecipes) => {
        return {
            title: foodRecipes.title,
            steps: foodRecipes.steps,
            author: foodRecipes.author,
            images: foodRecipes.images || null,
            createdAt: serverTimestamp()
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data() as FoodRecipes;
        return { ...data, id: snapshot.id };
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

function generateUniqueName() {
    const guid = uuidv4();
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedDate = `${year}${month}${day}_${hours}${minutes}${seconds}`;
    const uniqueName = `${guid}_${formattedDate}`;
    return uniqueName;
}
