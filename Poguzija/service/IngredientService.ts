import { Ingredient, IngredientNameUnit } from "../model/model"
import { GetCategoryData, GetIngredientsData, GetMeasurementUnitsData } from "./HelperService"

function GetIngredientNameUnitCategory(type: string) {
    let ingredientNameUnitCategory: Record<string, string[]> = {}
    switch (type) {
        case 'ingredient':
            ingredientNameUnitCategory = GetIngredientsData()
            break
        case 'unit':
            ingredientNameUnitCategory = GetMeasurementUnitsData()
            break
        case 'category':
            ingredientNameUnitCategory = GetCategoryData()
            break
    }

    const ingredientNameUnitCategoryArray: IngredientNameUnit[] = []
    for (const [type, names] of Object.entries(ingredientNameUnitCategory)) {
        const data = names.map((name: string) => ({
            name: name,
            isSelected: false
        }))
        ingredientNameUnitCategoryArray.push({
            type: type,
            data: data
        })
    }
    return ingredientNameUnitCategoryArray
}

function GetIngredientSections(ingredients: Ingredient[]) {
    return [...new Set(ingredients.map(ingredient => ingredient.group).filter((group): group is string => !!group))]
}

function GroupIngredientsBySections(ingredients: Ingredient[], sections: string[]) {
    const ungrouped = ingredients.filter(ingredient => !ingredient.group)
    const grouped = sections
        .map(section => ({ section, ingredients: ingredients.filter(ingredient => ingredient.group === section) }))
        .filter(group => group.ingredients.length > 0)
    return { ungrouped, grouped }
}

export {
    GetIngredientNameUnitCategory,
    GetIngredientSections,
    GroupIngredientsBySections,
}
