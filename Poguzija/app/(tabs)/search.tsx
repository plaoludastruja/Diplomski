import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView'
import CardFoodRecipes from '../../components/CardFoodRecipes'
import { useEffect, useState } from 'react'
import { FoodRecipes } from '../../model/model'
import { GetSearchResults } from '../../service/SearchService'
import { MaterialIcons } from '@expo/vector-icons'
import { AddCategoryModal } from '../../components/AddCategoryModal'
import { Pressable } from 'react-native'
import { COLORS, SIZES } from '../../constants/Colors'
import SelectIngredientList from '../../components/SelectIngredientList'
import LoadingScreen from '../../components/LoadingScreen'


export default function SearchScreen() {
    const [food, setFood] = useState<FoodRecipes[]>([])

    const [categoryModalVisible, setCategoryModalVisible] = useState(false)
    const [ingredientModalVisible, setIngredientModalVisible] = useState(false)

    const [categoryNumber, setCategoryNumber] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [ingredientData, setIngredientData] = useState<string[]>([])
    const [categoryData, setCategoryData] = useState<string[]>([])

    useEffect(() => {
        //fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const foodRecipesData = await GetSearchResults(['flour','eggs'])
            console.log('UI ', foodRecipesData)
            setFood(foodRecipesData)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const handleCloseCategoryModal = (selectedCategories: string[]) => {
        setCategoryNumber(selectedCategories.length)
        setCategoryModalVisible(false)
        setCategoryData(selectedCategories)
        //setSearchFields(selectedCategories)
    }

    const handleCloseIngredientModal = (selectedIngredients: string) => {
        setIngredientData([...ingredientData,selectedIngredients])
        setCategoryModalVisible(false)
        //setSearchFields(selectedCategories)
    }

    const handleSearch = async () => {
        setLoading(true)
        const searchParams = [...categoryData, ...ingredientData]
        const foodRecipesData = await GetSearchResults(searchParams)
        setLoading(false)
        console.log('UI ', foodRecipesData)
        setFood(foodRecipesData)
    }

    return (
        <BackgroundSafeAreaView>
            <Pressable style={styles.button} onPress={() => setCategoryModalVisible(true)}>
                <Text style={styles.buttonText}>Add categories</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => setIngredientModalVisible(true)}>
                <Text style={styles.buttonText}>Add ingredients</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => handleSearch()}>
                <Text style={styles.buttonText}>Search</Text>
            </Pressable>
            { loading ? <ActivityIndicator size="large" color={COLORS.tint} /> : 
            <FlatList
                data={food}
                renderItem={({ item }) => <CardFoodRecipes data={item} route={''} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.flex}
            />}

            <AddCategoryModal
                    visible={categoryModalVisible}
                    onClose={(selectedCategories: string[]) => handleCloseCategoryModal(selectedCategories)} />

            <SelectIngredientList 
                modalDataType={ 'ingredient' }
                visible={ ingredientModalVisible } 
                onAdd={ (item) => { handleCloseIngredientModal(item.name) }} 
                onClose={() => setIngredientModalVisible(false)} />
            
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
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
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: SIZES.large,
    },
})
