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
            'ONION_POWDER',
            'MARJORAM',
            'FENUGREEK',
            'STAR_ANISE',
            'MUSTARD_SEED',
            'FENNEL_SEED',
            'CAYENNE_PEPPER',
            'WHITE_PEPPER',
            'SMOKED_PAPRIKA'
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
            'SAGE',
            'LOVAGE',
            'LEMONGRASS',
            'LEMON_BALM',
            'WATERCRESS'
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
            'CORN',
            'LEEK',
            'ASPARAGUS',
            'ARTICHOKE',
            'OKRA',
            'FENNEL',
            'KOHLRABI',
            'GREEN_BEANS',
            'SPRING_ONION',
            'CHILI_PEPPER',
            'SQUASH'
        ],
        ROOT_VEGETABLES: [
            'BEETROOT',
            'RADISH',
            'TURNIP',
            'SWEET_POTATO',
            'PARSNIP',
            'HORSERADISH',
            'CELERY_ROOT',
            'RUTABAGA',
            'TARO',
            'CASSAVA'
        ],
        LEAFY_GREENS: [
            'LETTUCE',
            'SPINACH',
            'KALE',
            'ARUGULA',
            'CHARD',
            'COLLARD_GREENS',
            'ENDIVE',
            'SORREL',
            'BOK_CHOY'
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
            'FIG',
            'CHERRY',
            'NECTARINE',
            'PERSIMMON',
            'POMEGRANATE',
            'GUAVA',
            'PAPAYA',
            'DRAGON_FRUIT'
        ],
        CITRUS_FRUITS: [
            'LEMON',
            'LIME',
            'ORANGE',
            'GRAPEFRUIT',
            'TANGERINE',
            'CLEMENTINE',
            'POMELO'
        ],
        BERRIES: [
            'STRAWBERRY',
            'RASPBERRY',
            'BLUEBERRY',
            'BLACKBERRY',
            'CRANBERRY',
            'CURRANT',
            'GOOSEBERRY',
            'MULBERRY',
            'ELDERBERRY',
            'GOJI_BERRY'
        ],
        DRIED_FRUITS: [
            'RAISINS',
            'DRIED_APRICOT',
            'PRUNES',
            'DRIED_FIGS',
            'DATES',
            'DRIED_CRANBERRIES',
            'DRIED_MANGO',
            'DRIED_BANANA'
        ],
        MEAT: [
            'BEEF',
            'PORK',
            'LAMB',
            'VEAL',
            'SAUSAGE',
            'BACON',
            'HAM',
            'GROUND_MEAT',
            'VEAL_LEG',
            'VEAL_SHANK',
            'BEEF_STEAK',
            'RUMP_STEAK',
            'BEEF_RIBS',
            'PORK_LEG',
            'PORK_SHOULDER',
            'PORK_CHOP',
            'LAMB_LEG',
            'LAMB_CHOP',
            'BEEF_BRISKET',
            'BEEF_TENDERLOIN',
            'SIRLOIN',
            'T_BONE_STEAK',
            'PORK_BELLY',
            'PORK_TENDERLOIN',
            'PORK_NECK',
            'LIVER',
            'SALAMI',
            'PROSCIUTTO',
            'PANCETTA',
            'CEVAPI',
            'PLJESKAVICA',
            'KULEN',
            'SUDZUK',
            'CVARCI',
            'ODOJAK',
            'KRVAVICA',
            'VESALICA',
            'BUDZOLA',
            'PECENICA'
        ],
        POULTRY: [
            'CHICKEN',
            'CHICKEN_BREAST',
            'CHICKEN_THIGH',
            'CHICKEN_WING',
            'TURKEY',
            'DUCK',
            'CHICKEN_DRUMSTICK',
            'WHOLE_CHICKEN',
            'GOOSE',
            'QUAIL',
            'CHICKEN_LIVER'
        ],
        FISH: [
            'FISH',
            'SALMON',
            'TUNA',
            'TROUT',
            'SARDINE',
            'MACKEREL',
            'COD',
            'ANCHOVY',
            'SEA_BASS',
            'SEA_BREAM',
            'HERRING',
            'CATFISH',
            'CARP',
            'PERCH'
        ],
        SEAFOOD: [
            'SHRIMP',
            'CRAB',
            'MUSSELS',
            'SQUID',
            'OCTOPUS',
            'OYSTERS',
            'LOBSTER',
            'SCALLOPS',
            'CLAMS',
            'CRAYFISH'
        ],
        MILK_PRODUCTS: [
            'MILK',
            'CREAM',
            'SOUR_CREAM',
            'BUTTER',
            'KEFIR',
            'CONDENSED_MILK',
            'WHIPPED_CREAM',
            'BUTTERMILK',
            'GHEE',
            'POWDERED_MILK'
        ],
        CHEESE: [
            'CHEESE',
            'WHITE_CHEESE',
            'YELLOW_CHEESE',
            'COTTAGE_CHEESE',
            'MOZZARELLA',
            'PARMESAN',
            'FETA',
            'CREAM_CHEESE',
            'GOUDA',
            'CHEDDAR',
            'RICOTTA',
            'GRUYERE',
            'SMOKED_CHEESE'
        ],
        YOGURT: [
            'YOGURT',
            'GREEK_YOGURT',
            'PROBIOTIC_YOGURT',
            'DRINKING_YOGURT',
            'FLAVORED_YOGURT'
        ],
        EGGS: [
            'EGG',
            'EGG_WHITE',
            'EGG_YOLK',
            'QUAIL_EGG',
            'DUCK_EGG'
        ],
        CEREALS: [
            'OATMEAL',
            'CORN_FLAKES',
            'MUESLI',
            'BRAN',
            'GRANOLA',
            'CORN_GRITS'
        ],
        FLOUR: [
            'WHEAT_FLOUR',
            'CORN_FLOUR',
            'RICE_FLOUR',
            'WHOLE_WHEAT_FLOUR',
            'ALMOND_FLOUR',
            'RYE_FLOUR',
            'SEMOLINA',
            'SPELT_FLOUR',
            'OAT_FLOUR'
        ],
        BREAD: [
            'BREAD',
            'WHITE_BREAD',
            'WHOLE_WHEAT_BREAD',
            'BAGUETTE',
            'TOAST_BREAD',
            'PITA_BREAD',
            'CROISSANT',
            'RYE_BREAD',
            'SOURDOUGH_BREAD',
            'FLATBREAD',
            'CORNBREAD',
            'BUN',
            'BAGEL',
            'DONUT'
        ],
        PASTA: [
            'SPAGHETTI',
            'PENNE',
            'FUSILLI',
            'LASAGNA_SHEETS',
            'NOODLES',
            'MACARONI',
            'TAGLIATELLE',
            'RAVIOLI',
            'GNOCCHI',
            'ORZO',
            'TORTELLINI'
        ],
        LEGUMES: [
            'BEANS',
            'CHICKPEAS',
            'LENTILS',
            'PEAS',
            'SOYBEANS',
            'BLACK_BEANS',
            'MUNG_BEANS',
            'FAVA_BEANS',
            'EDAMAME'
        ],
        NUTS: [
            'WALNUT',
            'ALMOND',
            'HAZELNUT',
            'PEANUT',
            'CASHEW',
            'PISTACHIO',
            'PECAN',
            'BRAZIL_NUT',
            'MACADAMIA',
            'PINE_NUT',
            'CHESTNUT'
        ],
        SEEDS: [
            'SUNFLOWER_SEEDS',
            'PUMPKIN_SEEDS',
            'SESAME_SEEDS',
            'CHIA_SEEDS',
            'FLAXSEED',
            'POPPY_SEEDS',
            'HEMP_SEEDS'
        ],
        OILS: [
            'OLIVE_OIL',
            'VEGETABLE_OIL',
            'SESAME_OIL',
            'COCONUT_OIL',
            'SUNFLOWER_OIL',
            'CANOLA_OIL',
            'AVOCADO_OIL',
            'GRAPESEED_OIL'
        ],
        SAUCES: [
            'SOY_SAUCE',
            'TOMATO_SAUCE',
            'PESTO',
            'MAYONNAISE',
            'KETCHUP',
            'MUSTARD',
            'BBQ_SAUCE',
            'WORCESTERSHIRE_SAUCE',
            'HOT_SAUCE',
            'TZATZIKI',
            'TERIYAKI_SAUCE',
            'SRIRACHA',
            'AJVAR',
            'GRAVY'
        ],
        SWEETENERS: [
            'SUGAR',
            'BROWN_SUGAR',
            'HONEY',
            'MAPLE_SYRUP',
            'STEVIA',
            'POWDERED_SUGAR',
            'AGAVE_SYRUP',
            'MOLASSES',
            'VANILLA_SUGAR'
        ],
        BEVERAGES: [
            'WATER',
            'COFFEE',
            'TEA',
            'JUICE',
            'SODA',
            'WINE',
            'BEER',
            'LEMONADE',
            'HOT_CHOCOLATE',
            'SPARKLING_WATER',
            'ESPRESSO',
            'COCKTAIL'
        ],
        FROZEN_PRODUCTS: [
            'FROZEN_PEAS',
            'FROZEN_FRIES',
            'FROZEN_VEGETABLES',
            'FROZEN_PIZZA',
            'ICE_CREAM',
            'FROZEN_BERRIES',
            'FROZEN_SPINACH',
            'FROZEN_FISH'
        ],
        CANNED_FOOD: [
            'CANNED_BEANS',
            'CANNED_CORN',
            'CANNED_TOMATOES',
            'CANNED_TUNA',
            'CANNED_PEAS',
            'CANNED_MUSHROOMS',
            'CANNED_CHICKPEAS',
            'CANNED_PEACHES'
        ],
        READY_MEALS: [
            'INSTANT_NOODLES',
            'INSTANT_SOUP',
            'CANNED_SOUP',
            'DUMPLINGS'
        ],
        BAKING_INGREDIENTS: [
            'BAKING_POWDER',
            'BAKING_SODA',
            'YEAST',
            'VANILLA_EXTRACT',
            'COCOA_POWDER',
            'GELATIN',
            'CORNSTARCH',
            'CHOCOLATE_CHIPS',
            'ALMOND_EXTRACT'
        ],
        ADDITIVES: [
            'FOOD_COLORING',
            'PRESERVATIVES',
            'CITRIC_ACID',
            'XANTHAN_GUM',
            'MSG'
        ],
        SNACKS: [
            'CHIPS',
            'POPCORN',
            'PRETZELS',
            'CRACKERS',
            'GRANOLA_BAR',
            'TRAIL_MIX',
            'RICE_CAKES',
            'CHOCOLATE',
            'CANDY'
        ],
        CONDIMENTS: [
            'VINEGAR',
            'LEMON_JUICE',
            'PICKLES',
            'OLIVES',
            'CAPERS',
            'RELISH',
            'CHUTNEY',
            'PICKLED_PEPPERS'
        ],
        MUSHROOMS: [
            'MUSHROOM',
            'PORCINI',
            'OYSTER_MUSHROOM',
            'SHIITAKE',
            'CHANTERELLE',
            'PORTOBELLO',
            'TRUFFLE'
        ],
        GRAINS: [
            'RICE',
            'WHEAT',
            'OATS',
            'BARLEY',
            'QUINOA',
            'BUCKWHEAT',
            'MILLET',
            'BULGUR',
            'COUSCOUS',
            'POLENTA'
        ]
    }
}

export {
    GetIngredientsData,
    GetMeasurementUnitsData,
    GetCategoryData,
}
