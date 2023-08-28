import { FieldValue } from "firebase/firestore/lite";

export interface FoodRecipes {
    id: string;
    title: string;
    steps: string;
    author: string;
    image: string;
    createdAt: string
}

export interface MyComponentProps {
    children: React.ReactNode;
}