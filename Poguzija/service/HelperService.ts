import { writeBatch, doc } from "firebase/firestore/lite"; 
import { db } from "./firebase";
import { DatabaseCollection } from "../model/model";

async function AddIngredientsData() {
    const ingredients = [
        'Water', 'Salt', 'Sugar', 'Flour', 'Eggs', 'Butter', 'Milk', 'Rice', 'Chicken', 'Tomato', 'Onion',
        'Garlic', 'Potato', 'Olive Oil', 'Black Pepper', 'Lemon', 'Cheese', 'Pasta', 'Bread', 'Beef',
        'Lettuce', 'Carrot', 'Apple', 'Banana', 'Orange', 'Spinach', 'Avocado', 'Cucumber', 'Yogurt',
        'Honey', 'Soy Sauce', 'Vinegar', 'Cinnamon', 'Ginger', 'Nutmeg', 'Vanilla Extract', 'Baking Powder',
        'Cocoa Powder', 'Oregano', 'Basil', 'Parsley', 'Thyme', 'Rosemary', 'Cumin', 'Coriander', 'Paprika',
        'Chili Powder', 'Mustard', 'Mayonnaise', 'Ketchup', 'Soy Milk', 'Coconut Milk', 'Almond Milk', 'Wheat Flour',
        'Corn Flour', 'Baking Soda', 'Red Wine Vinegar', 'White Wine Vinegar', 'Rice Vinegar', 'Sesame Oil',
        'Fish Sauce', 'Worcestershire Sauce', 'Tabasco Sauce', 'Sriracha Sauce', 'Barbecue Sauce', 'Peanut Butter',
        'Nutella', 'Jam', 'Maple Syrup', 'Agave Syrup', 'Pesto Sauce', 'Tahini', 'Miso Paste', 'Curry Paste',
        'Tomato Sauce', 'Salsa', 'Guacamole', 'Hummus', 'Tzatziki', 'Ranch Dressing', 'Caesar Dressing',
        'Italian Dressing', 'Sesame Seeds', 'Pine Nuts', 'Almonds', 'Walnuts', 'Pecans', 'Cashews', 'Pistachios',
        'Sunflower Seeds', 'Pumpkin Seeds', 'Chia Seeds', 'Flaxseeds', 'Quinoa', 'Bulgur', 'Couscous', 'Barley',
        'Oats', 'Brown Rice', 'White Rice'
    ];

    const ingredientsTest = [
        'Water', 'Salt', 'Sugar', 'Flour', 'Eggs', 'Butter', 'Milk', 'Rice', 'Chicken', 'Tomato', 'Onion'
    ];
    try{
        console.log('Insert ingredients started')
        const batch = writeBatch(db);
        ingredients.forEach((ingredient, index) => {
            const ingredientRef = doc(db, DatabaseCollection.ingredients, (index + 1).toString());
            batch.set(ingredientRef, { name: ingredient });
        });
        await batch.commit();
        console.log('Insert ingredients finished succesfully')
    }catch(e){
        console.log('Insert ingredients failed', e)
    }
}

async function AddMeasurementUnitsData() {
    const measurementUnits = [
        'as needed', 'piece', 'teaspoon', 'tablespoon', 'cup', 'ounce', 'pound', 'gram', 'kilogram', 'milliliter', 'liter',
        'dash', 'pinch', 'drop', 'pint', 'quart', 'gallon', 'fluid ounce', 'shot', 'jigger', 'can',
        'bottle', 'package', 'slice', 'piece', 'stick', 'bunch', 'stalk', 'head', 'bulb', 'clove',
        'leaf', 'sprig', 'chop'
    ];

    try{
        console.log('Insert measurement units started')
        const batch = writeBatch(db);
        measurementUnits.forEach((measurementUnit, index) => {
            const ingredientRef = doc(db, DatabaseCollection.ingredients, (index + 1).toString());
            batch.set(ingredientRef, { name: measurementUnit });
        });
        await batch.commit();
        console.log('Insert measurement units finished succesfully')
    }catch(e){
        console.log('Insert measurement units failed', e)
    }
}

export {
    AddIngredientsData,
    AddMeasurementUnitsData
}