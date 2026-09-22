import { StyleSheet, View } from 'react-native'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'expo-router'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { PillButton } from '../Common/PillButton'
import { TranslationKeys } from '../../locales/_translationKeys'
import { GetMyFridge } from '../../service/FridgeService'
import { GetRandomFoodRecipe, GetSuggestedFoodRecipe } from '../../service/RecipesService'

export const RecipeSuggestions = () => {
    const { t } = useTranslation()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSuggestRecipe = async () => {
        if (loading) return
        setLoading(true)
        try {
            const fridge = await GetMyFridge()
            const ingredientNames = fridge?.ingredients.map(ingredient => ingredient.name) ?? []
            if (ingredientNames.length === 0) {
                Toast.show({ type: ALERT_TYPE.WARNING, title: t(TranslationKeys.Fridge.FRIDGE_EMPTY) })
                return
            }
            const recipe = await GetSuggestedFoodRecipe(ingredientNames)
            if (!recipe) {
                Toast.show({ type: ALERT_TYPE.WARNING, title: t(TranslationKeys.Fridge.NO_SUGGESTION_FOUND) })
                return
            }
            router.push(`/foodRecipesItem/${recipe.id}`)
        } catch {
            Toast.show({ type: ALERT_TYPE.DANGER, title: t(TranslationKeys.Error.LOADING_FAILED) })
        } finally {
            setLoading(false)
        }
    }

    const handleRandomRecipe = async () => {
        if (loading) return
        setLoading(true)
        try {
            const recipe = await GetRandomFoodRecipe()
            if (!recipe) {
                Toast.show({ type: ALERT_TYPE.WARNING, title: t(TranslationKeys.Fridge.NO_SUGGESTION_FOUND) })
                return
            }
            router.push(`/foodRecipesItem/${recipe.id}`)
        } catch {
            Toast.show({ type: ALERT_TYPE.DANGER, title: t(TranslationKeys.Error.LOADING_FAILED) })
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <PillButton onPress={handleSuggestRecipe}>{t(TranslationKeys.Fridge.SUGGEST_RECIPE)}</PillButton>
            <PillButton onPress={handleRandomRecipe}>{t(TranslationKeys.Fridge.RANDOM_RECIPE)}</PillButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '95%',
        alignItems: 'center',
    },
})
