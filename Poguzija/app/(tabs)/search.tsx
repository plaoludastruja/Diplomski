import { ActivityIndicator, Animated, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView'
import CardFoodRecipes from '../../components/CardFoodRecipes'
import { useEffect, useRef, useState } from 'react'
import { FoodRecipes } from '../../model/model'
import { GetSearchResults } from '../../service/SearchService'
import { MaterialIcons } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { COLORS, SIZES } from '../../constants/Colors'
import LoadingScreen from '../../components/LoadingScreen'
import GestureRecognizer from 'react-native-swipe-gestures'
import { SelectIngredientModal } from '../../components/SelectIngredientModal'
import { SelectCategoryModal } from '../../components/SelectCategoryModal'


export default function SearchScreen() {
    const [food, setFood] = useState<FoodRecipes[]>([])

    const [categoryModalVisible, setCategoryModalVisible] = useState(false)
    const [ingredientModalVisible, setIngredientModalVisible] = useState(false)

    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [ingredientData, setIngredientData] = useState<string[]>([])
    const [categoryData, setCategoryData] = useState<string[]>([])

    const handleCloseCategoryModal = (selectedCategories: string[]) => {
        setCategoryModalVisible(false)
        setCategoryData(selectedCategories)
    }

    const handleCloseIngredientModal = (selectedIngredients: string[]) => {
        setIngredientData(selectedIngredients)
        setIngredientModalVisible(false)
    }

    const handleSearch = async () => {
        setLoading(true)
        const searchData = search.toLowerCase().split(/[\s-\.,!?]/).filter(t => t.length >= 4)
        const searchParams = [...categoryData, ...ingredientData, ...searchData]
        
        if(searchParams.length === 0){
            setLoading(false)
            return
        }
        
        const foodRecipesData = await GetSearchResults(searchParams)
        setLoading(false)
        setFood(foodRecipesData)
        setScrollDirection('down')
    }

    const onDeleteSelected = (type: string, selectedItem: string) => {
        if(type === 'ingredient') {
            const updatedItems = ingredientData.filter((item) => item !== selectedItem)
            setIngredientData([...updatedItems])
        }
        if(type === 'category') {
            const updatedItems = categoryData.filter((item) => item !== selectedItem)
            setCategoryData([...updatedItems])
        }
    }

    const [scrollDirection, setScrollDirection] = useState('')
    const positionAnimation = useRef(new Animated.Value(0)).current

    const handleScroll = (event) => {
        const currentScrollPos = event.nativeEvent.contentOffset.y
        if (currentScrollPos > 0) {
            setScrollDirection('down')
        } else if (currentScrollPos <= 0 ) {
            setScrollDirection('up')
        }
    }

    useEffect(() => {
        if (scrollDirection === 'down') {
            Animated.parallel([
                Animated.timing(positionAnimation, {
                    toValue: -400,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start()
        } else if (scrollDirection === 'up') {
            Animated.parallel([
                Animated.timing(positionAnimation, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start()
        }
    }, [scrollDirection])

    return (
        <BackgroundSafeAreaView>
            <View style={styles.relativeContainer}>
            <Animated.View style={[ styles.animatedContainer, {transform: [{ translateY: positionAnimation }] }]}>
                <View style={styles.inputContainer}>
                    <MaterialIcons name="search" style={styles.icon} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Search"
                        value={search}
                        autoComplete='off'
                        onChangeText={text => {
                            setSearch(text)
                        }}
                    />
                </View>
                <Pressable style={styles.button} onPress={() => setCategoryModalVisible(true)}>
                    <Text style={styles.buttonText}>Select categories</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => setIngredientModalVisible(true)}>
                    <Text style={styles.buttonText}>Select ingredients</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => handleSearch()}>
                    <Text style={styles.buttonText}>Search</Text>
                </Pressable>
                <FlatList
                    data={categoryData}
                    style={styles.flex}
                    contentContainerStyle={[{alignContent: 'flex-start'}]}
                    renderItem={({ item }) => 
                        <Pressable style={ styles.buttonModalSelected } onPress={() => onDeleteSelected('category', item)}>
                            <Text style={styles.textStyle}>{item}</Text>
                            <MaterialIcons name="close" style={styles.iconButton} />
                        </Pressable>}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                />
                <FlatList
                    data={ingredientData}
                    style={styles.flex}
                    contentContainerStyle={[{alignContent: 'flex-start'}]}
                    renderItem={({ item }) => 
                        <Pressable style={ styles.buttonModalSelected } onPress={() => onDeleteSelected('ingredient', item)} >
                            <Text style={styles.textStyle}>{item}</Text>
                            <MaterialIcons name="close" style={styles.iconButton} />
                        </Pressable>}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                />
            </Animated.View>
            {loading ? <LoadingScreen /> :
            <GestureRecognizer style={styles.flex} onSwipeDown={(state) => { if(food.length!==0){setScrollDirection('up')}} } onSwipeUp={(state) => { if(food.length!==0){setScrollDirection('down')}}} >
                <View style={[styles.flex]}>
                    <FlatList
                        data={food}
                        renderItem={({ item }) => <CardFoodRecipes data={item} route={''} />}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        style={styles.flex}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    />
                </View>
            </GestureRecognizer>}

            <SelectCategoryModal
                alreadySelected={categoryData}
                visible={categoryModalVisible}
                onClose={(selectedCategories: string[]) => handleCloseCategoryModal(selectedCategories)} />

            <SelectIngredientModal
                alreadySelected={ingredientData}
                visible={ingredientModalVisible}
                onClose={(selectedIngredients: string[]) => handleCloseIngredientModal(selectedIngredients)} />

        </View>
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
    relativeContainer: {
        flex: 1,
        position: 'relative',
        width: '100%'
    },
    flex: {
        flex: 1,
        width: '100%',
    },
    animatedContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: SIZES.base,
        backgroundColor: COLORS.light,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        height: 60,
        backgroundColor: COLORS.light,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
        elevation: 2,
    },
    textInput: {
        width: '100%',
        marginRight: 10,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    icon: {
        marginRight: SIZES.medium,
        color: COLORS.lightDark,
        fontSize: SIZES.extraLarge,
    },
    buttonModalSelected: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        paddingHorizontal: SIZES.small,
        paddingVertical: 0.5 * SIZES.base,
        marginVertical: SIZES.base,
        marginHorizontal: 0.5 * SIZES.base,
        elevation: 2,
        backgroundColor: COLORS.dark,
    },
    textStyle: {
        color: COLORS.light,
        fontWeight: 'bold',
        fontSize: SIZES.medium,
        textAlign: 'center',
    },
    iconButton: {
        color: COLORS.lightDark,
        fontSize: SIZES.medium,
    },
})
