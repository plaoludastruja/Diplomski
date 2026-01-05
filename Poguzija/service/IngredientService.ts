import { Category, IngredientNameUnit } from "../model/model"
import { GetCategoryData, GetIngredientsData, GetMeasurementUnitsData } from "./HelperService"

function GetIngredientNameUnitCategory(type: string) {
    let ingredientNameUnitCategory: any
    switch(type){
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

export {
    GetIngredientNameUnitCategory,
}
