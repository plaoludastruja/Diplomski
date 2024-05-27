export interface MyUser {
    id: string
    email: string
    name: string
    surname: string
    fullName: string
    profilePhoto: string
    aditionalUserData: AdditionalUserData
    createdAt: string
}

export interface AdditionalUserData {
    recipeSchedulerId: string
}

export interface FoodRecipes {
    id: string
    title: string
    author: string
    servingSize: string
    ingredients: Ingredient[]
    steps: Step[]
    images: string[]
    createdAt: string
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