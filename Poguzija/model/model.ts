import { Timestamp } from "firebase/firestore/lite"

export interface MyUser {
    id: string
    email: string
    name: string
    surname: string
    fullName: string
    profilePhoto: string
    createdAt: Timestamp
}

export interface FoodRecipes {
    id: string
    title: string
    description: string
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

export interface Ingredient {
    name: string
    amount?: string
    unit: string
}

export interface Step {
    number: number
    description: string
}

export interface RecipeScheduler {
    id: string
    recipeByDay: RecipesByDay[]
}

export interface RecipesByDay {
    day: Day
    recipes: string[]
}

export interface RecipeSchedulerReturn {
    id: string
    recipeByDay: RecipesByDayReturn[]
}

export interface RecipesByDayReturn {
    day: Day
    recipes: FoodRecipes[]
}

export interface RecipeByDay {
    id: string
    title: string
    author: string
    images: string[]
}

export interface Fridge {
    id: string
    ingredients: Ingredient[]
}

export interface Bookmark {
    id: string
    savedFoodRecipesIds: string[]
}

export interface Comment {
    id: string
    authorName: string
    authorProfilePhoto: string
    text: string
    createdAt: Timestamp
}

export interface Category {
    type: string
    data: { name: string, isSelected: boolean}[]
}

export interface IngredientNameUnit {
    type: string
    data: { name: string, isSelected: boolean}[]
}

export interface SelectedIngredient {
    name: string, 
    isSelected: boolean
}

export interface Rating {
    sum: number
    count: number
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

export interface MyComponentProps {
    children: React.ReactNode
}

export enum StorageFolder {
    FoodRecipesImages = 'foodRecipesPhotos',
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