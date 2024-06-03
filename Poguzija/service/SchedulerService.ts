import { doc, updateDoc, getDoc, QueryDocumentSnapshot, collection, getDocs, query, setDoc } from "firebase/firestore/lite"
import { RecipeScheduler, DatabaseCollection, FoodRecipes, Day } from "../model/model"
import { db } from "./firebase"
import { getCurrentUser } from "./AuthService"
import { foodRecipesConverter } from "./RecipesService"

async function AddToScheduler(recipe: FoodRecipes, day: string) {
    const user = await getCurrentUser()
    const data = await getDoc(doc(db, DatabaseCollection.recipeSchedulers, user.id).withConverter(recipesSchedulerConverter))
    console.log('Data fetched at AddToScheduler()')
    let scheduler: RecipeScheduler = {
        id: "",
        recipeByDay: [],
    }
    if (data.exists()) {
        scheduler = data.data()
    }
    const dayIndex = scheduler.recipeByDay.findIndex(item => item.day === day)

    scheduler.recipeByDay[dayIndex].recipes.push({id: recipe.id, images: recipe.images, author: recipe.author, title: recipe.title})
    await updateDoc(doc(db, DatabaseCollection.recipeSchedulers, user.id), {
        recipeByDay: scheduler.recipeByDay
    })
    console.log('Data updated at AddToScheduler()')
}

async function RemoveFromScheduler(recipeToRemove: FoodRecipes, day: string) {
    const user = await getCurrentUser()
    const data = await getDoc(doc(db, DatabaseCollection.recipeSchedulers, user.id).withConverter(recipesSchedulerConverter))
    console.log('Data fetched at RemoveFromScheduler()')
    let scheduler: RecipeScheduler = {
        id: "",
        recipeByDay: [],
    }
    if (data.exists()) {
        scheduler = data.data()
    }
    const dayIndex = scheduler.recipeByDay.findIndex(item => item.day === day)

    scheduler.recipeByDay[dayIndex].recipes = scheduler.recipeByDay[dayIndex].recipes.filter(recipe => recipe.id !== recipeToRemove.id )
    await updateDoc(doc(db, DatabaseCollection.recipeSchedulers, user.id), {
        recipeByDay: scheduler.recipeByDay
    })
    console.log('Data updated at RemoveFromScheduler()')
}

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
    console.log('Data added at AddRecipesScheduler()')
}

async function GetRecipesScheduler() {
    const user = await getCurrentUser()
    if(user){
        return GetRecipesSchedulerByUser(user.id)
    }else{
        return GetRecipesSchedulerRandom()
    }
}
async function GetRecipesSchedulerByUser(id: string) {
    let recipeScheduler: RecipeScheduler = {
        id: "",
        recipeByDay: [],
    }
    const data = await getDoc(doc(db, DatabaseCollection.recipeSchedulers, id).withConverter(recipesSchedulerConverter))
    console.log('Data fetched at GetRecipesSchedulerByUser()')
    if (data.exists()) {
        recipeScheduler = data.data()
    }
    return recipeScheduler
}


async function GetRecipesSchedulerRandom() {
    const data = await getDocs(query(collection(db, DatabaseCollection.recipes).withConverter(foodRecipesConverter)))
    console.log('Data fetched at GetRecipesSchedulerRandom()')
    const foodRecipesData = data.docs.map(doc => (doc.data()))

    const daysOfWeek = Object.values(Day)
    let randomItemsByDay: RecipeScheduler = {
        recipeByDay: [],
        id: ""
    }

    daysOfWeek.forEach(day => {
        const randomIndexes = getRandomIndexes(foodRecipesData.length)
        const randomItems = randomIndexes.map(index => foodRecipesData[index])
        randomItemsByDay.recipeByDay.push({day: day, recipes: randomItems})
    })
    return randomItemsByDay
}

const getRandomIndexes = (length: number) => {
    const indexes: Array<number> = []
    while (indexes.length < 3) {
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
    AddToScheduler,
    RemoveFromScheduler,
    AddRecipesScheduler,
    GetRecipesScheduler,
}