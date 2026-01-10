export namespace TranslationKeys {
    export enum Recipe {
        NAME = 'recipe.name',
        DESCRIPTION = 'recipe.description',
        TIME_TO_PREPARE = 'recipe.timeToPrepare',
        SERVING_SIZE = 'recipe.servingSize',
        INGREDIENTS = 'recipe.ingredients',
        INSTRUCTIONS = 'recipe.instructions',
        FILL_ALL_FIELDS = 'recipe.fillAllFields',
        RECIPE_CREATED = 'recipe.recipeCreated',
        RECIPE_NOT_CREATED = 'recipe.recipeNotCreated',
        DELETE_IMAGE = 'recipe.deleteImage',
        DELETE_IMAGE_CONFIRMATION = 'recipe.deleteImageConfirmation',
        ADD_FIRST_STEP = 'recipe.addFirstStep',
        ADD_NEXT_STEP = 'recipe.addNextStep',
        SELECTED_CATEGORIES = 'recipe.selectedCategories',
        ADD_CATEGORIES = 'recipe.addCategories',
        ADD_INGREDIENT = 'recipe.addIngredient',
        CREATE_RECIPE = 'recipe.createRecipe',
        EDIT_RECIPE = 'recipe.editRecipe',
        RECIPE_EDITED = 'recipe.recipeEdited',
        DELETE_RECIPE = 'recipe.deleteRecipe',
        RECIPE_DELETED = 'recipe.recipeDeleted',
    }

    export enum Ingredient {
        NAME = 'ingredient.name',
        AMOUNT = 'ingredient.amount',
        UNIT = 'ingredient.unit',
    }

    export enum Review {
        REVIEWS = 'review.reviews',
        SHOW_REVIEWS = 'review.showReviews',
        WRITE_REVIEW = 'review.writeReview',
        CREATE_REVIEW = 'review.createReview',
    }

    export enum Scheduler {
        RECIPE_ADDED_TO_SCHEDULER = 'scheduler.recipeAddedToScheduler',
        RECIPE_ALREADY_ADDED_TO_SCHEDULER = 'scheduler.recipeAlreadyAddedToScheduler',
    }

    export enum Day {
        MONDAY = 'days.monday',
        TUESDAY = 'days.tuesday',
        WEDNESDAY = 'days.wednesday',
        THURSDAY = 'days.thursday',
        FRIDAY = 'days.friday',
        SATURDAY = 'days.saturday',
        SUNDAY = 'days.sunday'
    }

    export enum Bookmark {
        SAVED = 'bookmark.saved',
    }

    export enum Search {
        SELECT_CATEGORY = 'search.selectCategory',
        SELECT_INGREDIENT = 'search.selectIngredient',
    }

    export enum Fridge {
        MY_KITCHEN = 'fridge.myKitchen',
        MY_RECIPES = 'fridge.myRecipes',
        MY_FRIDGE = 'fridge.myFridge',
        SUGGEST_RECIPE = 'fridge.suggestRecipe',
        RANDOM_RECIPE = 'fridge.randomRecipe'
    }

    export enum Button {
        SAVE = 'button.save',
        CANCEL = 'button.cancel',
        SUBMIT = 'button.submit',
        DELETE = 'button.delete',
        ADD = 'button.add',
        SEARCH = 'button.search',
        LOG_IN = 'button.logIn',
        LOG_OUT = 'button.logOut'
    }

    export enum Settings {
        SETTINGS = 'settings.settings',
        SELECT_THEME = 'settings.selectTheme',
        THEME = 'settings.theme',
        DARK_THEME = 'settings.darkTheme',
        LIGHT_THEME = 'settings.lightTheme',
        SELECT_LANGUAGE = 'settings.selectLanguage',
        LANGUAGE = 'settings.language',
        SR = 'settings.sr',
        EN = 'settings.en'
    }

    export enum Missing {
        Text = 'missing.text',
        Link = 'missing.link',
    }

    export enum CategoryType {
        MEAL_TYPE = 'categoryType.mealType',
        NATIONAL_COUSINE = 'categoryType.nationalCousine',
        POPULAR_CATEGORY = 'categoryType.popularCategory',
    }

    export enum CategoryItem {
        BREAKFAST = 'categoryItem.breakfast',
        LUNCH = 'categoryItem.lunch',
        DINNER = 'categoryItem.dinner',
        BRUNCH = 'categoryItem.brunch',
        DESSERT = 'categoryItem.dessert',
        SNACK = 'categoryItem.snack',
        SERBIAN = 'categoryItem.serbian',
        ASIAN = 'categoryItem.asian',
        GREEK = 'categoryItem.greek',
        TURKISH = 'categoryItem.turkish',
        AMERICAN = 'categoryItem.american',
        ITALIAN = 'categoryItem.italian',
        LATIN = 'categoryItem.latin',
        BUDGET_FRIENDLY = 'categoryItem.budgetFriendly',
        QUICK = 'categoryItem.quick',
        EASY = 'categoryItem.easy',
        HEALTY = 'categoryItem.healty',
        BBQ = 'categoryItem.bbq',
        FISH = 'categoryItem.fish',
        MEAT = 'categoryItem.meat',
        SANDWICHES = 'categoryItem.sandwiches',
        VEGETERIAN = 'categoryItem.vegeterian',
        VEGE = 'categoryItem.vege',
        SALAD = 'categoryItem.salad',
        PASTA = 'categoryItem.pasta',
        SMOOTHIE = 'categoryItem.smoothie',
        FASTING = 'categoryItem.fasting',
        SWEET = 'categoryItem.sweet',
        SALTY = 'categoryItem.salty',
        FRUITY = 'categoryItem.fruity',
        VEGETABLE = 'categoryItem.vegetable',
        DRINK = 'categoryItem.drink',
        DOUGH = 'categoryItem.dough'
    }

    export enum UnitType {
        COMMON = 'unitType.common',
        MASS = 'unitType.mass',
        LIQUID = 'unitType.liquid',
        CUPS_SPOONS = 'unitType.cupsSpoons',
        SPECIAL = 'unitType.special',
    }

    export enum UnitItem {
        PIECE = 'unitItem.piece',
        AS_NEEDED = 'unitItem.asNeeded',
        AS_DESIRED = 'unitItem.asDesired',
        KILOGRAM = 'unitItem.kilogram',
        GRAM = 'unitItem.gram',
        LITER = 'unitItem.liter',
        DECILITER = 'unitItem.deciliter',
        MILILITER = 'unitItem.mililiter',
        DROP = 'unitItem.drop',
        BIG_CUP = 'unitItem.bigCup',
        SMALL_CUP = 'unitItem.smallCup',
        SHOT_CUP = 'unitItem.shotCup',
        SPOONFUL = 'unitItem.spoonful',
        TABLESPOON = 'unitItem.tablespoon',
        TEASPOON = 'unitItem.teaspoon',
        HANDFUL = 'unitItem.handful',
        PINCH = 'unitItem.pinch',
        SLICE = 'unitItem.slice',
        BOTTLE = 'unitItem.bottle',
        CAN = 'unitItem.can',
        PACKAGE = 'unitItem.package',
        HEAD = 'unitItem.head',
        LEAF = 'unitItem.leaf',
        CLOVE = 'unitItem.clove',
    }

    /*export enum IngredientType {
        VEGETABLE = 'ingredientType.vegetable',
        FRUIT = 'ingredientType.fruit',
        MEAT = 'ingredientType.meat',
        FISH = 'ingredientType.fish',
        DAIRY = 'ingredientType.dairy',
        MILK = 'ingredientType.milk',
        GRAINS = 'ingredientType.grains',
        NUTS = 'ingredientType.nuts',
        OILS = 'ingredientType.oils',
        SWEETENERS = 'ingredientType.sweeteners',
        FLOUR = 'ingredientType.spices',
        SPICES = 'ingredientType.spices',
        KONZERVE = 'ingredientType.spices',
        MUSHROOMS = 'ingredientType.spices',
        EGGS = 'ingredientType.meat',
        LIQUIDS = 'ingredientType.liquids',
        GOTOVI = 'ingredientType.spices',
        PASTA = 'ingredientType.spices',
        SUSENE = 'ingredientType.spices',
        HELTHY = 'ingredientType.spices',
        SPREADS = 'ingredientType.spices',
        SAUCE = 'ingredientType.meat',
        SEAFOOD = 'ingredientType.seaf',
        READY_PRODUCTS = 'ingredientType.ready_products',
        LEGUMES = 'ingredientType.legumes',
        POULTRY = 'ingredientType.poultry',
        BAKERY = 'ingredientType.bakery',
    }*/

    export enum IngredientType {
        SPICES = 'ingredientType.spices',
        HERBS = 'ingredientType.herbs',
        VEGETABLES = 'ingredientType.vegetables',
        ROOT_VEGETABLES = 'ingredientType.rootVegetables',
        LEAFY_GREENS = 'ingredientType.leafyGreens',
        FRUITS = 'ingredientType.fruits',
        CITRUS_FRUITS = 'ingredientType.citrusFruits',
        BERRIES = 'ingredientType.berries',
        DRIED_FRUITS = 'ingredientType.driedFruits',
        MEAT = 'ingredientType.meat',
        POULTRY = 'ingredientType.poultry',
        FISH = 'ingredientType.fish',
        SEAFOOD = 'ingredientType.seafood',
        MILK_PRODUCTS = 'ingredientType.milkProducts',
        CHEESE = 'ingredientType.cheese',
        YOGURT = 'ingredientType.yogurt',
        EGGS = 'ingredientType.eggs',
        CEREALS = 'ingredientType.cereals',
        FLOUR = 'ingredientType.flour',
        BREAD = 'ingredientType.bread',
        PASTA = 'ingredientType.pasta',
        LEGUMES = 'ingredientType.legumes',
        NUTS = 'ingredientType.nuts',
        SEEDS = 'ingredientType.seeds',
        OILS = 'ingredientType.oils',
        SAUCES = 'ingredientType.sauces',
        SWEETENERS = 'ingredientType.sweeteners',
        BEVERAGES = 'ingredientType.beverages',
        FROZEN_PRODUCTS = 'ingredientType.frozenProducts',
        CANNED_FOOD = 'ingredientType.cannedFood',
        READY_MEALS = 'ingredientType.readyMeals',
        BAKING_INGREDIENTS = 'ingredientType.bakingIngredients',
        ADDITIVES = 'ingredientType.additives',
        SNACKS = 'ingredientType.snacks',
        CONDIMENTS = 'ingredientType.condiments',
        MUSHROOMS = 'ingredientType.mushrooms',
        GRAINS = 'ingredientType.grains'
    }
    
    export enum IngredientItem {
        // Spices
        SALT = 'ingredientItem.salt',
        PEPPER = 'ingredientItem.pepper',
        PAPRIKA = 'ingredientItem.paprika',
        CINNAMON = 'ingredientItem.cinnamon',
        TURMERIC = 'ingredientItem.turmeric',
        CUMIN = 'ingredientItem.cumin',
        CORIANDER = 'ingredientItem.coriander',
        GINGER = 'ingredientItem.ginger',
        CLOVES = 'ingredientItem.cloves',
        NUTMEG = 'ingredientItem.nutmeg',
        BAY_LEAF = 'ingredientItem.bay_leaf',
        
        // Liquids
        WATER = 'ingredientItem.water',
        MILK = 'ingredientItem.milk',
        OLIVE_OIL = 'ingredientItem.olive_oil',
        VEGETABLE_OIL = 'ingredientItem.vegetable_oil',
        VINEGAR = 'ingredientItem.vinegar',
        SOY_SAUCE = 'ingredientItem.soy_sauce',
        HONEY = 'ingredientItem.honey',
        LEMON_JUICE = 'ingredientItem.lemon_juice',
        
        // Meat
        BEEF = 'ingredientItem.beef',
        PORK = 'ingredientItem.pork',
        CHICKEN = 'ingredientItem.chicken',
        LAMB = 'ingredientItem.lamb',
        TURKEY = 'ingredientItem.turkey',
        
        // Poultry
        CHICKEN_BREAST = 'ingredientItem.chicken_breast',
        CHICKEN_THIGH = 'ingredientItem.chicken_thigh',
        CHICKEN_WING = 'ingredientItem.chicken_wing',
        DUCK = 'ingredientItem.duck',
        
        // Fish & Seafood
        FISH = 'ingredientItem.fish',
        SALMON = 'ingredientItem.salmon',
        TUNA = 'ingredientItem.tuna',
        SHRIMP = 'ingredientItem.shrimp',
        CRAB = 'ingredientItem.crab',
        
        // Vegetables
        CARROT = 'ingredientItem.carrot',
        POTATO = 'ingredientItem.potato',
        ONION = 'ingredientItem.onion',
        GARLIC = 'ingredientItem.garlic',
        TOMATO = 'ingredientItem.tomato',
        CUCUMBER = 'ingredientItem.cucumber',
        LETTUCE = 'ingredientItem.lettuce',
        SPINACH = 'ingredientItem.spinach',
        
        // Fruits
        APPLE = 'ingredientItem.apple',
        BANANA = 'ingredientItem.banana',
        ORANGE = 'ingredientItem.orange',
        LEMON = 'ingredientItem.lemon',
        STRAWBERRY = 'ingredientItem.strawberry',
        GRAPE = 'ingredientItem.grape',
        MANGO = 'ingredientItem.mango',
        PINEAPPLE = 'ingredientItem.pineapple',
        
        // Dairy
        CHEESE = 'ingredientItem.cheese',
        YOGURT = 'ingredientItem.yogurt',
        BUTTER = 'ingredientItem.butter',
        CREAM = 'ingredientItem.cream',
        
        // Cereals & Grains
        RICE = 'ingredientItem.rice',
        WHEAT = 'ingredientItem.wheat',
        OATS = 'ingredientItem.oats',
        BARLEY = 'ingredientItem.barley',
        
        // Nuts & Legumes
        ALMONDS = 'ingredientItem.almonds',
        WALNUTS = 'ingredientItem.walnuts',
        PEANUTS = 'ingredientItem.peanuts',
        CHICKPEAS = 'ingredientItem.chickpeas',
        LENTILS = 'ingredientItem.lentils',
        
        // Bakery
        BREAD = 'ingredientItem.bread',
        PASTA = 'ingredientItem.pasta',
        CAKE = 'ingredientItem.cake',
        CROISSANT = 'ingredientItem.croissant',
        
        // Ready Products
        FROZEN_PIZZA = 'ingredientItem.frozen_pizza',
        INSTANT_NOODLES = 'ingredientItem.instant_noodles',
        CHIPS = 'ingredientItem.chips',
        CANNED_BEANS = 'ingredientItem.canned_beans',
        FROZEN_FRIES = 'ingredientItem.frozen_fries'
    }
}
