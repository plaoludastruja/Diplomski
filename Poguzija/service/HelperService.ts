import { addDoc, collection } from "firebase/firestore/lite"
import { db } from "./firebase"
import { Category, DatabaseCollection } from "../model/model"

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
    ]
    const newIngredientsArray = ingredients.map((ingredient, index) => ({
        id: index + 1,
        name: ingredient
    }))
    const newIngredients = { ingredients: newIngredientsArray }
    addDoc(collection(db, DatabaseCollection.ingredients), newIngredients)
}

async function AddMeasurementUnitsData() {
    const measurementUnits = [
        'as needed', 'piece', 'teaspoon', 'tablespoon', 'cup', 'ounce', 'pound', 'gram', 'kilogram', 'milliliter', 'liter',
        'dash', 'pinch', 'drop', 'pint', 'quart', 'gallon', 'fluid ounce', 'shot', 'jigger', 'can',
        'bottle', 'package', 'slice', 'piece', 'stick', 'bunch', 'stalk', 'head', 'bulb', 'clove',
        'leaf', 'sprig', 'chop'
    ]
    const newMeasurementUnitsArray = measurementUnits.map((unit, index) => ({
        id: index + 1,
        name: unit
    }))
    const newMeasurementUnits = { units: newMeasurementUnitsArray }
    addDoc(collection(db, DatabaseCollection.units), newMeasurementUnits)
}

function GetCategoryData() {
    const categories = {
        'MEAL_TYPE': ['BREAKFAST', 'LUNCH', 'DINNER', 'BRUNCH', 'DESSERT', 'SNACK'],
        'NATIONAL_COUSINE': ['SERBIAN', 'ASIAN', 'GREEK', 'TURKISH', 'AMERICAN', 'ITALIAN', 'LATIN'],
        'POPULAR_CATEGORY': ['BUDGET_FRIENDLY', 'QUICK', 'EASY', 'BBQ', 'FISH', 'MEAT', 'SANDWICHES', 'HEALTY', 'VEGETERIAN', 'VEGE', 'FASTING', 'SALAD', 'PASTA', 'SMOOTHIE', 'SWEET', 'FRUITY', 'VEGETABLE', 'DRINK' ],
    }
    const categoriesArray: Category[] = []
    for (const [type, names] of Object.entries(categories)) {
        const data = names.map(name => ({
            name: name,
            isSelected: false
        }))
        categoriesArray.push({
            type: type,
            data: data
        })
    }
    return categoriesArray;
}

export {
    AddIngredientsData,
    AddMeasurementUnitsData,
    GetCategoryData,
}
