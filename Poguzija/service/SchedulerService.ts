import { setDoc, doc, updateDoc, getDoc, QueryDocumentSnapshot } from "firebase/firestore/lite";
import { RecipeScheduler, Day, DatabaseCollection, FoodRecipes } from "../model/model";
import { db } from "./firebase";
import { getCurrentUser } from "./UserService";

export async function AddToScheduler(recipe: FoodRecipes, day: string) {
    const user = await getCurrentUser();
    // Retrieve the current array of recipes for the specific da
    const data = await getDoc(doc(db, DatabaseCollection.recipeSchedulers, user.aditionalUserData.recipeSchedulerId).withConverter(recipesSchedulerConverter));
    let scheduler: RecipeScheduler = {
        id: "",
        user: "",
        recipeByDay: [],
    }
    if (data.exists()) {
        scheduler = data.data()
        console.log("Document data:", scheduler);
    }
    // Find the index of the day in the recipeByDay array
    const dayIndex = scheduler.recipeByDay.findIndex(item => item.day === day);

    if (dayIndex !== -1) {
      // Push the new recipe item into the recipes array for the specific day
    scheduler.recipeByDay[dayIndex].recipes.push({id: recipe.id, images: recipe.images, author: recipe.author, title: recipe.title});


    console.log('Recipe added successfully.');
    } else {
        console.log('Day not found.');
    }
    await updateDoc(doc(db, DatabaseCollection.recipeSchedulers, user.aditionalUserData.recipeSchedulerId), {
        recipeByDay: scheduler.recipeByDay
    });
}

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