import { FieldValue } from "firebase/firestore/lite";

export interface FoodRecipes {
    id: string;
    title: string;
    author: string;
    servingSize: string;
    ingredients: Ingredient[];
    steps: Step[];
    images: string[];
    createdAt: string
}

export interface MyComponentProps {
    children: React.ReactNode;
}

export enum StorageFolder {
    FoodRecipesPhotos = 'foodRecipesPhotos',
}

export interface Ingredient {
    name: string;
    amount: string;
    unit: string;
}

export interface Step {
    number: number;
    description: string;
}