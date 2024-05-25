import { QueryDocumentSnapshot, addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore/lite";
import { db, storage } from "./firebase";
import { DatabaseCollection, Day, FoodRecipes, RecipeScheduler } from "../model/model";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
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



export function AddRecipesScheduler(id: string, user: string) {
    const recipeScheduler: RecipeScheduler = {
        id: id,
        user: user,
        recipeByDay: [
            { day: Day.MONDAY, recipes: [] },
            { day: Day.TUESDAY, recipes: [] },
            { day: Day.WEDNESDAY, recipes: [] },
            { day: Day.THURSDAY, recipes: [] },
            { day: Day.FRIDAY, recipes: [] },
            { day: Day.SATURDAY, recipes: [] },
            { day: Day.SUNDAY, recipes: [] }
        ]
    }
    setDoc(doc(db, DatabaseCollection.recipeSchedulers, id).withConverter(recipesSchedulerConverter), recipeScheduler);
}

export async function GetRecipesScheduler() {
    const user = await getCurrentUser()
    if(user){
        return GetRecipesSchedulerByUser(user.aditionalUserData.recipeSchedulerId)
    }else{
        return GetRecipesSchedulerRandom()
    }
}
export async function GetRecipesSchedulerByUser(id: string) {
    let recipeScheduler: RecipeScheduler = {
        id: "",
        user: "",
        recipeByDay: [],
    }
    const data = await getDoc(doc(db, DatabaseCollection.recipeSchedulers, id).withConverter(recipesSchedulerConverter));
    if (data.exists()) {
        recipeScheduler = data.data();
        console.log("Document data:", recipeScheduler);
    }
    return recipeScheduler
}


export async function GetRecipesSchedulerRandom() {
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter)));
    const foodRecipesData = data.docs.map(doc => (doc.data()));

    const daysOfWeek = Object.values(Day);
    let randomItemsByDay: RecipeScheduler = {
        user: "",
        recipeByDay: [],
        id: ""
    }

    daysOfWeek.forEach(day => {
        const randomIndexes = getRandomIndexes(foodRecipesData.length);
        const randomItems = randomIndexes.map(index => foodRecipesData[index]);
        randomItemsByDay.recipeByDay.push({day: day, recipes: randomItems})
    })

    return randomItemsByDay;
}

const getRandomIndexes = (length: number) => {
    const indexes: Array<number> = [];
    while (indexes.length < 3) {
        const randomIndex = Math.floor(Math.random() * length);
        if (!indexes.includes(randomIndex)) {
            indexes.push(randomIndex);
        }
    }
    return indexes;
};

// Firestore data converter
const foodRecipesConverter = {
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

const recipesSchedulerConverter = {
    toFirestore: (recipeScheduler: RecipeScheduler) => {
        return {
            user: recipeScheduler.user,
            recipeByDay: recipeScheduler.recipeByDay
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data() as RecipeScheduler;
        return { ...data, id: snapshot.id };
    }
};

/*export function EditFoodRecipe(id:string) {
    //return getDocs(query(collection(db, DatabaseCollection.recipes), orderBy('createdAt', "desc")));
    setDoc(doc(db, DatabaseCollection.recipes, id), {
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
