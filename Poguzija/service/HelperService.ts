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
        'bottle', 'package', 'slice', 'stick', 'bunch', 'stalk', 'head', 'bulb', 'clove',
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
    return {
        'MEAL_TYPE': [
            'BREAKFAST', 
            'LUNCH', 
            'DINNER', 
            'BRUNCH', 
            'DESSERT', 
            'SNACK'
        ],
        'NATIONAL_COUSINE': [
            'SERBIAN', 
            'ASIAN', 
            'GREEK', 
            'TURKISH', 
            'AMERICAN', 
            'ITALIAN', 
            'LATIN'
        ],
        'POPULAR_CATEGORY': [
            'BUDGET_FRIENDLY', 
            'QUICK', 
            'EASY', 
            'BBQ', 
            'FISH', 
            'MEAT', 
            'SANDWICHES', 
            'HEALTY', 
            'VEGETERIAN', 
            'VEGE', 
            'FASTING', 
            'SALAD', 
            'PASTA', 
            'SMOOTHIE', 
            'SWEET', 
            'FRUITY', 
            'VEGETABLE', 
            'DRINK', 
            'DOUGH' 
        ],
    }
}

function GetMeasurementUnitsData() {
    return {
        'COMMON': [
            'PIECE',
            'AS_NEEDED',
            'AS_DESIRED',
        ],
        'MASS': [
            'KILOGRAM',
            'GRAM',
        ],
        'LIQUID': [
            'LITER',
            'DECILITER',
            'MILILITER',
            'DROP',
        ],
        'CUPS_SPOONS': [
            'BIG_CUP',
            'SMALL_CUP',
            'SHOT_CUP',
            'SPOONFUL',
            'TABLESPOON',
            'TEASPOON',
            'HANDFUL',
            'PINCH'
        ],
        'SPECIAL': [
            'SLICE',
            'BOTTLE',
            'CAN',
            'PACKAGE',
            'HEAD',
            'LEAF',
            'CLOVE',
        ]
    }
}

function GetIngredientsData() {
    return {
        SPICES: [
            'SALT',
            'PEPPER',
            'PAPRIKA',
            'CHILI_POWDER',
            'CINNAMON',
            'TURMERIC',
            'CUMIN',
            'CORIANDER',
            'GINGER',
            'CLOVES',
            'NUTMEG',
            'BAY_LEAF',
            'CURRY_POWDER',
            'SAFFRON',
            'CARDAMOM',
            'ALLSPICE',
            'GARLIC_POWDER',
            'ONION_POWDER'
        ],
        HERBS: [
            'BASIL',
            'PARSLEY',
            'DILL',
            'OREGANO',
            'THYME',
            'ROSEMARY',
            'MINT',
            'CHIVES',
            'TARRAGON',
            'SAGE'
        ],
        VEGETABLES: [
            'CARROT',
            'POTATO',
            'ONION',
            'GARLIC',
            'TOMATO',
            'CUCUMBER',
            'BELL_PEPPER',
            'ZUCCHINI',
            'EGGPLANT',
            'BROCCOLI',
            'CAULIFLOWER',
            'CABBAGE',
            'CELERY',
            'PUMPKIN',
            'CORN'
        ],
        ROOT_VEGETABLES: [
            'BEETROOT',
            'RADISH',
            'TURNIP',
            'SWEET_POTATO',
            'PARSNIP',
            'HORSERADISH',
            'CELERY_ROOT'
        ],
        LEAFY_GREENS: [
            'LETTUCE',
            'SPINACH',
            'KALE',
            'ARUGULA',
            'CHARD'
        ],
        FRUITS: [
            'APPLE',
            'BANANA',
            'PEAR',
            'PEACH',
            'PLUM',
            'WATERMELON',
            'MELON',
            'GRAPE',
            'KIWI',
            'MANGO',
            'PINEAPPLE',
            'APRICOT',
            'FIG'
        ],
        CITRUS_FRUITS: [
            'LEMON',
            'LIME',
            'ORANGE',
            'GRAPEFRUIT',
            'TANGERINE'
        ],
        BERRIES: [
            'STRAWBERRY',
            'RASPBERRY',
            'BLUEBERRY',
            'BLACKBERRY',
            'CRANBERRY',
            'CURRANT'
        ],
        DRIED_FRUITS: [
            'RAISINS',
            'DRIED_APRICOT',
            'PRUNES',
            'DRIED_FIGS',
            'DATES'
        ],
        MEAT: [
            'BEEF',
            'PORK',
            'LAMB',
            'VEAL',
            'SAUSAGE',
            'BACON',
            'HAM',
            'GROUND_MEAT'
        ],
        POULTRY: [
            'CHICKEN',
            'CHICKEN_BREAST',
            'CHICKEN_THIGH',
            'CHICKEN_WING',
            'TURKEY',
            'DUCK'
        ],
        FISH: [
            'FISH',
            'SALMON',
            'TUNA',
            'TROUT',
            'SARDINE',
            'MACKEREL',
            'COD',
            'ANCHOVY'
        ],
        SEAFOOD: [
            'SHRIMP',
            'CRAB',
            'MUSSELS',
            'SQUID',
            'OCTOPUS',
            'OYSTERS'
        ],
        MILK_PRODUCTS: [
            'MILK',
            'CREAM',
            'SOUR_CREAM',
            'BUTTER',
            'KEFIR',
            'CONDENSED_MILK'
        ],
        CHEESE: [
            'CHEESE',
            'WHITE_CHEESE',
            'YELLOW_CHEESE',
            'COTTAGE_CHEESE',
            'MOZZARELLA',
            'PARMESAN',
            'FETA',
            'CREAM_CHEESE'
        ],
        YOGURT: [
            'YOGURT',
            'GREEK_YOGURT',
            'PROBIOTIC_YOGURT'
        ],
        EGGS: [
            'EGG',
            'EGG_WHITE',
            'EGG_YOLK',
            'QUAIL_EGG'
        ],
        CEREALS: [
            'OATMEAL',
            'CORN_FLAKES',
            'MUESLI',
            'BRAN'
        ],
        FLOUR: [
            'WHEAT_FLOUR',
            'CORN_FLOUR',
            'RICE_FLOUR',
            'WHOLE_WHEAT_FLOUR',
            'ALMOND_FLOUR'
        ],
        BREAD: [
            'BREAD',
            'WHITE_BREAD',
            'WHOLE_WHEAT_BREAD',
            'BAGUETTE',
            'TOAST_BREAD',
            'PITA_BREAD',
            'CROISSANT'
        ],
        PASTA: [
            'SPAGHETTI',
            'PENNE',
            'FUSILLI',
            'LASAGNA_SHEETS',
            'NOODLES',
            'MACARONI'
        ],
        LEGUMES: [
            'BEANS',
            'CHICKPEAS',
            'LENTILS',
            'PEAS',
            'SOYBEANS'
        ],
        NUTS: [
            'WALNUT',
            'ALMOND',
            'HAZELNUT',
            'PEANUT',
            'CASHEW',
            'PISTACHIO',
            'PECAN'
        ],
        SEEDS: [
            'SUNFLOWER_SEEDS',
            'PUMPKIN_SEEDS',
            'SESAME_SEEDS',
            'CHIA_SEEDS',
            'FLAXSEED',
            'POPPY_SEEDS'
        ],
        OILS: [
            'OLIVE_OIL',
            'VEGETABLE_OIL',
            'SESAME_OIL',
            'COCONUT_OIL'
        ],
        SAUCES: [
            'SOY_SAUCE',
            'TOMATO_SAUCE',
            'PESTO',
            'MAYONNAISE',
            'KETCHUP',
            'MUSTARD',
            'BBQ_SAUCE',
            'WORCESTERSHIRE_SAUCE'
        ],
        SWEETENERS: [
            'SUGAR',
            'BROWN_SUGAR',
            'HONEY',
            'MAPLE_SYRUP',
            'STEVIA',
            'POWDERED_SUGAR'
        ],
        BEVERAGES: [
            'WATER',
            'COFFEE',
            'TEA',
            'JUICE',
            'SODA',
            'WINE'
        ],
        FROZEN_PRODUCTS: [
            'FROZEN_PEAS',
            'FROZEN_FRIES',
            'FROZEN_VEGETABLES',
            'FROZEN_PIZZA',
            'ICE_CREAM'
        ],
        CANNED_FOOD: [
            'CANNED_BEANS',
            'CANNED_CORN',
            'CANNED_TOMATOES',
            'CANNED_TUNA',
            'CANNED_PEAS'
        ],
        READY_MEALS: [
            'INSTANT_NOODLES',
            'INSTANT_SOUP',
            'CANNED_SOUP'
        ],
        BAKING_INGREDIENTS: [
            'BAKING_POWDER',
            'BAKING_SODA',
            'YEAST',
            'VANILLA_EXTRACT',
            'COCOA_POWDER',
            'GELATIN'
        ],
        ADDITIVES: [
            'FOOD_COLORING',
            'PRESERVATIVES',
            'CITRIC_ACID',
            'XANTHAN_GUM'
        ],
        SNACKS: [
            'CHIPS',
            'POPCORN',
            'PRETZELS',
            'CRACKERS'
        ],
        CONDIMENTS: [
            'VINEGAR',
            'LEMON_JUICE',
            'PICKLES',
            'OLIVES',
            'CAPERS'
        ],
        MUSHROOMS: [
            'MUSHROOM',
            'PORCINI',
            'OYSTER_MUSHROOM',
            'SHIITAKE'
        ],
        GRAINS: [
            'RICE',
            'WHEAT',
            'OATS',
            'BARLEY',
            'QUINOA',
            'BUCKWHEAT'
        ]
    }
}

export {
    GetIngredientsData,
    GetMeasurementUnitsData,
    GetCategoryData,
}
