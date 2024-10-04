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
        BUDGET_FRIENDLY = 'categoryItem.budgerFriendly',
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

    export enum IngredientType {
        SPICES = 'ingredientType.spices',
        MEAT = 'ingredientType.meat',
    }

    export enum IngredientItem {
        SALT = 'ingredientItem.salt',
        FISH = 'ingredientItem.fish',
    }

    export enum UnitType {
        CUPS = 'unitType.cups',
        COMMON = 'unitType.common',
    }

    export enum UnitItem {
        HALF = 'unitItem.half',
        AS_NEEDED = 'unitItem.asNeeded',
    }
}
