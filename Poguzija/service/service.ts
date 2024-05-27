import { QueryDocumentSnapshot, addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore/lite";
import { db, storage } from "./firebase";
import { DatabaseCollection, Day, FoodRecipes, RecipeScheduler } from "../model/model";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from "./UserService";
import { foodRecipesConverter } from "./RecipesService";

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
