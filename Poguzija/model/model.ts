import { Timestamp } from "firebase/firestore/lite"

export interface MyUser {
    id: string
    email: string
    name: string
    surname: string
    fullName: string
    profilePhoto: string
    aditionalUserData: AdditionalUserData
    createdAt: Timestamp
}

export interface AdditionalUserData {
    recipeSchedulerId: string,
    fridgeId: string,
    bookmarkId: string
}

export interface FoodRecipes {
    id: string
    title: string
    author: string
    cookingTime: string
    servingSize: string
    ingredients: Ingredient[]
    steps: Step[]
    images: string[]
    searchFields: string[]
    savedCount: number
    rating: Rating
    createdAt: Timestamp
}

export interface MyComponentProps {
    children: React.ReactNode
}

export enum StorageFolder {
    FoodRecipesPhotos = 'foodRecipesPhotos',
}

export enum DatabaseCollection {
    users = 'users',
    recipes = 'foodRecipes',
    recipeSchedulers = 'recipeSchedulers',
    ingredients = 'ingredients',
    units = 'units',
    fridges = 'fridges',
    bookmarks = 'bookmarks',
    comments = 'comments'
}

export interface Ingredient {
    name: string
    amount: string
    unit: string
}

export interface Step {
    number: number
    description: string
}

export interface RecipeScheduler {
    id: string
    user: string
    recipeByDay: RecipesByDay[]
}

export interface RecipesByDay {
    day: Day
    recipes: RecipeByDay[]
}

export interface Fridge {
    id: string
    user: string
    ingredients: Ingredient[]
}

export interface Bookmark {
    id: string
    user: string
    savedFoodRecipesIds: string[]
}

export interface Comment {
    id: string
    authorName: string
    authorProfilePhoto: string
    text: string
    createdAt: Timestamp
}

export enum Day {
    MONDAY = 'Monday',
    TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday',
    THURSDAY = 'Thursday',
    FRIDAY = 'Friday',
    SATURDAY = 'Saturday',
    SUNDAY = 'Sunday'
}

export interface RecipeByDay {
    id: string
    title: string
    author: string
    images: string[]
}

export interface Category {
    type: string
    data: { name: string, isSelected: boolean}[]
}

export interface Rating {
    sum: number
    count: number
}