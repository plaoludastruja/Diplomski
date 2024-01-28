import { FieldValue } from "firebase/firestore/lite";

export interface FoodRecipes {
    id: string;
    title: string;
    steps: string;
    author: string;
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