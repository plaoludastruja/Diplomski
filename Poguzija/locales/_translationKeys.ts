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

    export enum Tab {
        FOOD = 'tab.food',
        SEARCH = 'tab.search',
        CREATE_RECIPE = 'tab.createRecipe',
        MEAL_PLAN = 'tab.mealPlan',
        MY_FRIDGE = 'tab.myFridge',
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
        CHILI_POWDER = 'ingredientItem.chiliPowder',
        CINNAMON = 'ingredientItem.cinnamon',
        TURMERIC = 'ingredientItem.turmeric',
        CUMIN = 'ingredientItem.cumin',
        CORIANDER = 'ingredientItem.coriander',
        GINGER = 'ingredientItem.ginger',
        CLOVES = 'ingredientItem.cloves',
        NUTMEG = 'ingredientItem.nutmeg',
        BAY_LEAF = 'ingredientItem.bayLeaf',
        CURRY_POWDER = 'ingredientItem.curryPowder',
        SAFFRON = 'ingredientItem.saffron',
        CARDAMOM = 'ingredientItem.cardamom',
        ALLSPICE = 'ingredientItem.allspice',
        GARLIC_POWDER = 'ingredientItem.garlicPowder',
        ONION_POWDER = 'ingredientItem.onionPowder',

        // Herbs
        BASIL = 'ingredientItem.basil',
        PARSLEY = 'ingredientItem.parsley',
        DILL = 'ingredientItem.dill',
        OREGANO = 'ingredientItem.oregano',
        THYME = 'ingredientItem.thyme',
        ROSEMARY = 'ingredientItem.rosemary',
        MINT = 'ingredientItem.mint',
        CHIVES = 'ingredientItem.chives',
        TARRAGON = 'ingredientItem.tarragon',
        SAGE = 'ingredientItem.sage',

        // Vegetables
        CARROT = 'ingredientItem.carrot',
        POTATO = 'ingredientItem.potato',
        ONION = 'ingredientItem.onion',
        GARLIC = 'ingredientItem.garlic',
        TOMATO = 'ingredientItem.tomato',
        CUCUMBER = 'ingredientItem.cucumber',
        BELL_PEPPER = 'ingredientItem.bellPepper',
        ZUCCHINI = 'ingredientItem.zucchini',
        EGGPLANT = 'ingredientItem.eggplant',
        BROCCOLI = 'ingredientItem.broccoli',
        CAULIFLOWER = 'ingredientItem.cauliflower',
        CABBAGE = 'ingredientItem.cabbage',
        CELERY = 'ingredientItem.celery',
        PUMPKIN = 'ingredientItem.pumpkin',
        CORN = 'ingredientItem.corn',

        // Root vegetables
        BEETROOT = 'ingredientItem.beetroot',
        RADISH = 'ingredientItem.radish',
        TURNIP = 'ingredientItem.turnip',
        SWEET_POTATO = 'ingredientItem.sweetPotato',
        PARSNIP = 'ingredientItem.parsnip',
        HORSERADISH = 'ingredientItem.horseradish',
        CELERY_ROOT = 'ingredientItem.celeryRoot',

        // Leafy greens
        LETTUCE = 'ingredientItem.lettuce',
        SPINACH = 'ingredientItem.spinach',
        KALE = 'ingredientItem.kale',
        ARUGULA = 'ingredientItem.arugula',
        CHARD = 'ingredientItem.chard',

        // Fruits
        APPLE = 'ingredientItem.apple',
        BANANA = 'ingredientItem.banana',
        PEAR = 'ingredientItem.pear',
        PEACH = 'ingredientItem.peach',
        PLUM = 'ingredientItem.plum',
        WATERMELON = 'ingredientItem.watermelon',
        MELON = 'ingredientItem.melon',
        GRAPE = 'ingredientItem.grape',
        KIWI = 'ingredientItem.kiwi',
        MANGO = 'ingredientItem.mango',
        PINEAPPLE = 'ingredientItem.pineapple',
        APRICOT = 'ingredientItem.apricot',
        FIG = 'ingredientItem.fig',

        // Citrus fruits
        LEMON = 'ingredientItem.lemon',
        LIME = 'ingredientItem.lime',
        ORANGE = 'ingredientItem.orange',
        GRAPEFRUIT = 'ingredientItem.grapefruit',
        TANGERINE = 'ingredientItem.tangerine',

        // Berries
        STRAWBERRY = 'ingredientItem.strawberry',
        RASPBERRY = 'ingredientItem.raspberry',
        BLUEBERRY = 'ingredientItem.blueberry',
        BLACKBERRY = 'ingredientItem.blackberry',
        CRANBERRY = 'ingredientItem.cranberry',
        CURRANT = 'ingredientItem.currant',

        // Dried fruits
        RAISINS = 'ingredientItem.raisins',
        DRIED_APRICOT = 'ingredientItem.driedApricot',
        PRUNES = 'ingredientItem.prunes',
        DRIED_FIGS = 'ingredientItem.driedFigs',
        DATES = 'ingredientItem.dates',

        // Meat
        BEEF = 'ingredientItem.beef',
        PORK = 'ingredientItem.pork',
        LAMB = 'ingredientItem.lamb',
        VEAL = 'ingredientItem.veal',
        SAUSAGE = 'ingredientItem.sausage',
        BACON = 'ingredientItem.bacon',
        HAM = 'ingredientItem.ham',
        GROUND_MEAT = 'ingredientItem.groundMeat',

        // Poultry
        CHICKEN = 'ingredientItem.chicken',
        CHICKEN_BREAST = 'ingredientItem.chickenBreast',
        CHICKEN_THIGH = 'ingredientItem.chickenThigh',
        CHICKEN_WING = 'ingredientItem.chickenWing',
        TURKEY = 'ingredientItem.turkey',
        DUCK = 'ingredientItem.duck',

        // Fish
        FISH = 'ingredientItem.fish',
        SALMON = 'ingredientItem.salmon',
        TUNA = 'ingredientItem.tuna',
        TROUT = 'ingredientItem.trout',
        SARDINE = 'ingredientItem.sardine',
        MACKEREL = 'ingredientItem.mackerel',
        COD = 'ingredientItem.cod',
        ANCHOVY = 'ingredientItem.anchovy',

        // Seafood
        SHRIMP = 'ingredientItem.shrimp',
        CRAB = 'ingredientItem.crab',
        MUSSELS = 'ingredientItem.mussels',
        SQUID = 'ingredientItem.squid',
        OCTOPUS = 'ingredientItem.octopus',
        OYSTERS = 'ingredientItem.oysters',

        // Milk products
        MILK = 'ingredientItem.milk',
        CREAM = 'ingredientItem.cream',
        SOUR_CREAM = 'ingredientItem.sourCream',
        BUTTER = 'ingredientItem.butter',
        KEFIR = 'ingredientItem.kefir',
        CONDENSED_MILK = 'ingredientItem.condensedMilk',

        // Cheese
        CHEESE = 'ingredientItem.cheese',
        WHITE_CHEESE = 'ingredientItem.whiteCheese',
        YELLOW_CHEESE = 'ingredientItem.yellowCheese',
        COTTAGE_CHEESE = 'ingredientItem.cottageCheese',
        MOZZARELLA = 'ingredientItem.mozzarella',
        PARMESAN = 'ingredientItem.parmesan',
        FETA = 'ingredientItem.feta',
        CREAM_CHEESE = 'ingredientItem.creamCheese',

        // Yogurt
        YOGURT = 'ingredientItem.yogurt',
        GREEK_YOGURT = 'ingredientItem.greekYogurt',
        PROBIOTIC_YOGURT = 'ingredientItem.probioticYogurt',

        // Eggs
        EGG = 'ingredientItem.egg',
        EGG_WHITE = 'ingredientItem.eggWhite',
        EGG_YOLK = 'ingredientItem.eggYolk',
        QUAIL_EGG = 'ingredientItem.quailEgg',

        // Cereals
        OATMEAL = 'ingredientItem.oatmeal',
        CORN_FLAKES = 'ingredientItem.cornFlakes',
        MUESLI = 'ingredientItem.muesli',
        BRAN = 'ingredientItem.bran',

        // Flour
        WHEAT_FLOUR = 'ingredientItem.wheatFlour',
        CORN_FLOUR = 'ingredientItem.cornFlour',
        RICE_FLOUR = 'ingredientItem.riceFlour',
        WHOLE_WHEAT_FLOUR = 'ingredientItem.wholeWheatFlour',
        ALMOND_FLOUR = 'ingredientItem.almondFlour',

        // Bread
        BREAD = 'ingredientItem.bread',
        WHITE_BREAD = 'ingredientItem.whiteBread',
        WHOLE_WHEAT_BREAD = 'ingredientItem.wholeWheatBread',
        BAGUETTE = 'ingredientItem.baguette',
        TOAST_BREAD = 'ingredientItem.toastBread',
        PITA_BREAD = 'ingredientItem.pitaBread',
        CROISSANT = 'ingredientItem.croissant',

        // Pasta
        SPAGHETTI = 'ingredientItem.spaghetti',
        PENNE = 'ingredientItem.penne',
        FUSILLI = 'ingredientItem.fusilli',
        LASAGNA_SHEETS = 'ingredientItem.lasagnaSheets',
        NOODLES = 'ingredientItem.noodles',
        MACARONI = 'ingredientItem.macaroni',

        // Legumes
        BEANS = 'ingredientItem.beans',
        CHICKPEAS = 'ingredientItem.chickpeas',
        LENTILS = 'ingredientItem.lentils',
        PEAS = 'ingredientItem.peas',
        SOYBEANS = 'ingredientItem.soybeans',

        // Nuts
        WALNUT = 'ingredientItem.walnut',
        ALMOND = 'ingredientItem.almond',
        HAZELNUT = 'ingredientItem.hazelnut',
        PEANUT = 'ingredientItem.peanut',
        CASHEW = 'ingredientItem.cashew',
        PISTACHIO = 'ingredientItem.pistachio',
        PECAN = 'ingredientItem.pecan',

        // Seeds
        SUNFLOWER_SEEDS = 'ingredientItem.sunflowerSeeds',
        PUMPKIN_SEEDS = 'ingredientItem.pumpkinSeeds',
        SESAME_SEEDS = 'ingredientItem.sesameSeeds',
        CHIA_SEEDS = 'ingredientItem.chiaSeeds',
        FLAXSEED = 'ingredientItem.flaxseed',
        POPPY_SEEDS = 'ingredientItem.poppySeeds',

        // Oils
        OLIVE_OIL = 'ingredientItem.oliveOil',
        VEGETABLE_OIL = 'ingredientItem.vegetableOil',
        SESAME_OIL = 'ingredientItem.sesameOil',
        COCONUT_OIL = 'ingredientItem.coconutOil',

        // Sauces
        SOY_SAUCE = 'ingredientItem.soySauce',
        TOMATO_SAUCE = 'ingredientItem.tomatoSauce',
        PESTO = 'ingredientItem.pesto',
        MAYONNAISE = 'ingredientItem.mayonnaise',
        KETCHUP = 'ingredientItem.ketchup',
        MUSTARD = 'ingredientItem.mustard',
        BBQ_SAUCE = 'ingredientItem.bbqSauce',
        WORCESTERSHIRE_SAUCE = 'ingredientItem.worcestershireSauce',

        // Sweeteners
        SUGAR = 'ingredientItem.sugar',
        BROWN_SUGAR = 'ingredientItem.brownSugar',
        HONEY = 'ingredientItem.honey',
        MAPLE_SYRUP = 'ingredientItem.mapleSyrup',
        STEVIA = 'ingredientItem.stevia',
        POWDERED_SUGAR = 'ingredientItem.powderedSugar',

        // Beverages
        WATER = 'ingredientItem.water',
        COFFEE = 'ingredientItem.coffee',
        TEA = 'ingredientItem.tea',
        JUICE = 'ingredientItem.juice',
        SODA = 'ingredientItem.soda',
        WINE = 'ingredientItem.wine',

        // Frozen products
        FROZEN_PEAS = 'ingredientItem.frozenPeas',
        FROZEN_FRIES = 'ingredientItem.frozenFries',
        FROZEN_VEGETABLES = 'ingredientItem.frozenVegetables',
        FROZEN_PIZZA = 'ingredientItem.frozenPizza',
        ICE_CREAM = 'ingredientItem.iceCream',

        // Canned food
        CANNED_BEANS = 'ingredientItem.cannedBeans',
        CANNED_CORN = 'ingredientItem.cannedCorn',
        CANNED_TOMATOES = 'ingredientItem.cannedTomatoes',
        CANNED_TUNA = 'ingredientItem.cannedTuna',
        CANNED_PEAS = 'ingredientItem.cannedPeas',

        // Ready meals
        INSTANT_NOODLES = 'ingredientItem.instantNoodles',
        INSTANT_SOUP = 'ingredientItem.instantSoup',
        CANNED_SOUP = 'ingredientItem.cannedSoup',

        // Baking ingredients
        BAKING_POWDER = 'ingredientItem.bakingPowder',
        BAKING_SODA = 'ingredientItem.bakingSoda',
        YEAST = 'ingredientItem.yeast',
        VANILLA_EXTRACT = 'ingredientItem.vanillaExtract',
        COCOA_POWDER = 'ingredientItem.cocoaPowder',
        GELATIN = 'ingredientItem.gelatin',

        // Additives
        FOOD_COLORING = 'ingredientItem.foodColoring',
        PRESERVATIVES = 'ingredientItem.preservatives',
        CITRIC_ACID = 'ingredientItem.citricAcid',
        XANTHAN_GUM = 'ingredientItem.xanthanGum',

        // Snacks
        CHIPS = 'ingredientItem.chips',
        POPCORN = 'ingredientItem.popcorn',
        PRETZELS = 'ingredientItem.pretzels',
        CRACKERS = 'ingredientItem.crackers',

        // Condiments
        VINEGAR = 'ingredientItem.vinegar',
        LEMON_JUICE = 'ingredientItem.lemonJuice',
        PICKLES = 'ingredientItem.pickles',
        OLIVES = 'ingredientItem.olives',
        CAPERS = 'ingredientItem.capers',

        // Mushrooms
        MUSHROOM = 'ingredientItem.mushroom',
        PORCINI = 'ingredientItem.porcini',
        OYSTER_MUSHROOM = 'ingredientItem.oysterMushroom',
        SHIITAKE = 'ingredientItem.shiitake',

        // Grains
        RICE = 'ingredientItem.rice',
        WHEAT = 'ingredientItem.wheat',
        OATS = 'ingredientItem.oats',
        BARLEY = 'ingredientItem.barley',
        QUINOA = 'ingredientItem.quinoa',
        BUCKWHEAT = 'ingredientItem.buckwheat',
    }
}
