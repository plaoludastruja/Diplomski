import { doc, updateDoc, getDoc, QueryDocumentSnapshot, collection, getDocs, query, setDoc, limit } from "firebase/firestore/lite"
import { RecipeScheduler, DatabaseCollection, FoodRecipes, Day, RecipeSchedulerReturn } from "../model/model"
import { db } from "./firebase"
import { GetCurrentUser } from "./AuthService"
import { foodRecipesConverter } from "./RecipesService"


function AddRecipesScheduler(id: string) {
    const recipeScheduler: RecipeScheduler = {
        id: id,
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
    setDoc(doc(db, DatabaseCollection.recipeSchedulers, id).withConverter(recipesSchedulerConverter), recipeScheduler)
}

async function GetRecipesScheduler() {
    const user = await GetCurrentUser()
    if (user) {
        return GetMyRecipesScheduler(user.id)
    } else {
        return GetRecipesSchedulerRandom()
    }
}

async function AddToMyScheduler(recipe: FoodRecipes, day: keyof typeof Day) {
    const user = await GetCurrentUser()
    if (!user) return
    const data = await getDoc(doc(db, DatabaseCollection.recipeSchedulers, user.id).withConverter(recipesSchedulerConverter))
    let scheduler: RecipeScheduler = {
        id: "",
        recipeByDay: [],
    }
    if (data.exists()) {
        scheduler = data.data()
    }
    const dayIndex = scheduler.recipeByDay.findIndex(item => item.day === Day[day])
    const recipeExists = scheduler.recipeByDay[dayIndex].recipes.some(id => id === recipe.id)
    if(recipeExists) return false
    scheduler.recipeByDay[dayIndex].recipes.push(recipe.id)
    updateDoc(doc(db, DatabaseCollection.recipeSchedulers, user.id), {
        recipeByDay: scheduler.recipeByDay
    })
    return true
}

async function RemoveFromScheduler(recipeToRemove: FoodRecipes, day: string) {
    const user = await GetCurrentUser()
    if (!user) return
    const data = await getDoc(doc(db, DatabaseCollection.recipeSchedulers, user.id).withConverter(recipesSchedulerConverter))
    let scheduler: RecipeScheduler = {
        id: "",
        recipeByDay: [],
    }
    if (data.exists()) {
        scheduler = data.data()
    }
    const dayIndex = scheduler.recipeByDay.findIndex(item => item.day === day)
    scheduler.recipeByDay[dayIndex].recipes = scheduler.recipeByDay[dayIndex].recipes.filter(id => id !== recipeToRemove.id)
    await updateDoc(doc(db, DatabaseCollection.recipeSchedulers, user.id), {
        recipeByDay: scheduler.recipeByDay
    })
}

async function SwapFromScheduler(recipeToRemove: FoodRecipes, day: string) {

}

async function GetMyRecipesScheduler(id: string) {
    let recipeScheduler: RecipeScheduler = {
        id: id,
        recipeByDay: [],
    }
    const data = await getDoc(doc(db, DatabaseCollection.recipeSchedulers, id).withConverter(recipesSchedulerConverter))
    if (data.exists()) {
        recipeScheduler = data.data()
    }

    const recipePromises = recipeScheduler.recipeByDay.map(day =>  day.recipes.map(id => getDoc(doc(db, DatabaseCollection.recipes, id)))).flat()
    const recipeSnapshots = await Promise.all(recipePromises)

    const allFoodRecipes = recipeSnapshots
    .filter(doc => doc.exists()).
        map(docE =>  ({
            id: docE.id,
            ...docE.data()
        } as FoodRecipes))

    const recipeSchedulerData: RecipeSchedulerReturn = {
        id: id,
        recipeByDay: recipeScheduler.recipeByDay.map((day) => {
            return {
                day: day.day,
                recipes: day.recipes.map(id => allFoodRecipes.find(recipe => recipe.id === id)).filter(r => r !== undefined)
            }
        })
    }
    return recipeSchedulerData
}

async function GetRecipesSchedulerRandom() {
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter), limit(14)))
    const foodRecipesData = data.docs.map(doc => (doc.data()))
    const daysOfWeek = Object.values(Day)
    let randomItemsByDay: RecipeSchedulerReturn = {
        recipeByDay: [],
        id: ""
    }
    daysOfWeek.forEach(day => {
        const randomIndexes = getRandomIndexes(foodRecipesData.length)
        const randomItems = randomIndexes.map(index => foodRecipesData[index])
        randomItemsByDay.recipeByDay.push({ day: day, recipes: randomItems })
    })
    return randomItemsByDay
}

const getRandomIndexes = (length: number) => {
    const indexes: Array<number> = []
    while (indexes.length < 2) {
        const randomIndex = Math.floor(Math.random() * length)
        if (!indexes.includes(randomIndex)) {
            indexes.push(randomIndex)
        }
    }
    return indexes
}

const recipesSchedulerConverter = {
    toFirestore: (recipeScheduler: RecipeScheduler) => {
        return {
            recipeByDay: recipeScheduler.recipeByDay
        }
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
        const data = snapshot.data() as RecipeScheduler
        return { ...data, id: snapshot.id }
    }
}

export {
    AddRecipesScheduler,
    GetRecipesScheduler,
    AddToMyScheduler,
    RemoveFromScheduler,
    SwapFromScheduler
}
