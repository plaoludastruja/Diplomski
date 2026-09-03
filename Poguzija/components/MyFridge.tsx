import { Text, StyleSheet, View, Pressable } from 'react-native'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Ingredient } from '../model/model'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../constants/Colors'
import { UserContext } from '../app/_layout'
import { AddIngredientsModal } from './AddIngredientsModal'
import { AddToMyFridge, GetMyFridge } from '../service/FridgeService'
import { LoadingScreen } from './LoadingScreen'
import { ScrollView } from 'react-native-gesture-handler'
import { TranslationKeys } from '../locales/_translationKeys'
import { useTranslation } from 'react-i18next'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'

export const MyFridge = () => {
    const { user } = useContext(UserContext)
    const {t} = useTranslation()
    const [loading, setLoading] = useState(true)
    const [ingredientsModalVisible, setIngredientsModalVisible] = useState(false)
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([])
    const [ingredientEdit, setIngredientEdit] = useState<Ingredient>()

    const handleAddIngredient = (newIngredient: Ingredient) => {
        const updatedIngredients = selectedIngredients.map(ingredient =>
            ingredient.name === newIngredient.name ? newIngredient : ingredient
        )
        if (!updatedIngredients.some(ingredient => ingredient.name === newIngredient.name)) {
            updatedIngredients.push(newIngredient)
        }
        setSelectedIngredients(updatedIngredients)
        AddToMyFridge(updatedIngredients)
    }
    const handleDeleteIngredient = (index: number) => {
        const updatedIngredients = selectedIngredients.filter((_, i) => i !== index)
        setSelectedIngredients(updatedIngredients)
        AddToMyFridge(updatedIngredients)
    }

    const handlePressToEdit = (ingredient: Ingredient) => {
        setIngredientEdit(ingredient)
        setIngredientsModalVisible(true)
    }

    const handleClose = () => {
        setIngredientsModalVisible(false)
        setIngredientEdit(undefined)
    }

    const fetchData = useCallback(async () => {
        try {
            const fridgeData = await GetMyFridge()
            setSelectedIngredients(fridgeData?.ingredients ?? [])
        } catch (error) {
            console.error('[MyFridge] fetchData failed:', error)
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        } finally {
            setLoading(false)
        }
    }, [t])

    useEffect(() => {
        if(user){
            setLoading(true)
            fetchData()
        }else{
            setSelectedIngredients([])
            setLoading(false)
        }
    },[user, fetchData])

    if (loading) return <LoadingScreen />

    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={() => setIngredientsModalVisible(true)}>
                <Text style={styles.buttonText}>{t(TranslationKeys.Recipe.ADD_INGREDIENT)}</Text>
            </Pressable>
            <ScrollView style={styles.flex} horizontal={false} showsVerticalScrollIndicator={false}>
            {selectedIngredients?.map((ingredient, index) => (
                <Pressable key={index} style={styles.ingredientItem} onPress={() => handlePressToEdit(ingredient)}>
                    <Text style={[styles.textInput, { width: "auto" }]}>   {t(TranslationKeys.IngredientItem[ingredient.name as keyof typeof TranslationKeys.IngredientItem]) || ingredient.name}   -   {ingredient.amount}  {t(TranslationKeys.UnitItem[ingredient.unit as keyof typeof TranslationKeys.UnitItem] || ingredient.unit).toLowerCase()}</Text>
                    <Pressable onPress={() => handleDeleteIngredient(index)}>
                        <MaterialIcons name="delete" style={styles.icon} />
                    </Pressable>
                </Pressable>
            ))}
            </ScrollView>
            
            <AddIngredientsModal
                visible={ingredientsModalVisible}
                dataEdit={ingredientEdit}
                onAdd={handleAddIngredient}
                onClose={handleClose} />
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: SIZES.large,
    },
    flex: {
        flex: 1,
        width: '100%',
    },
    button: {
        textAlign: 'center',
        justifyContent: 'center',
        width: '85%',
        backgroundColor: COLORS.tint,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.base,
        marginVertical: SIZES.base,
        elevation: 2,
    },
    ingredientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        backgroundColor: COLORS.dark,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    textInput: {
        width: '100%',
        marginRight: 10,
        color: COLORS.white,
        fontSize: SIZES.large,
    },
    icon: {
        marginRight: 10,
        color: COLORS.white,
        fontSize: SIZES.extraLarge,
    },
})
