import { ActivityIndicator, Animated, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView'
import CardFoodRecipes from '../../components/CardFoodRecipes'
import { useEffect, useRef, useState } from 'react'
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
    const [search, setSearch] = useState('')
    const [ingredientData, setIngredientData] = useState<string[]>([])
    const [categoryData, setCategoryData] = useState<string[]>([])

    const handleCloseCategoryModal = (selectedCategories: string[]) => {
        setCategoryNumber(selectedCategories.length)
        setCategoryModalVisible(false)
        setCategoryData(selectedCategories)
        //setSearchFields(selectedCategories)
    }

    const handleCloseIngredientModal = (selectedIngredients: string) => {
        setIngredientData([...ingredientData, selectedIngredients])
        setCategoryModalVisible(false)
        //setSearchFields(selectedCategories)
    }

    const handleSearch = async () => {
        setLoading(true)
        const searchData = search.toLowerCase()
        console.log(searchData)
        const searchParams = [...categoryData, ...ingredientData, searchData]
        console.log(searchParams)
        const foodRecipesData = await GetSearchResults(searchParams)
        setLoading(false)
        console.log('UI ', foodRecipesData)
        setFood(foodRecipesData)
        setScrollDirection('down')
    }

    const [scrollDirection, setScrollDirection] = useState('');
    const prevScrollPos = useRef(0);
    const buttonAnimation = useRef(new Animated.Value(1)).current; // Initialize animated value
    const positionAnimation = useRef(new Animated.Value(0)).current; // Initialize position animated value
    const positionAnimationFlatList = useRef(new Animated.Value(0)).current; // Initialize position animated value

    const handleScroll = (event) => {
        const currentScrollPos = event.nativeEvent.contentOffset.y;
        if (currentScrollPos > 0) {
            // Scroll down and not at the very top
            setScrollDirection('down');
        } else if (currentScrollPos <= 0) {
            // Scroll up
            setScrollDirection('up');
        }
        prevScrollPos.current = currentScrollPos;
    };

    useEffect(() => {
        if (scrollDirection === 'down') {
            // Hide button
            Animated.parallel([
                Animated.timing(buttonAnimation, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(positionAnimation, {
                    toValue: -400, // Adjust this value based on your layout
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(positionAnimationFlatList, {
                    toValue: SIZES.extraLarge, // Adjust this value based on your layout
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else if (scrollDirection === 'up') {
            // Show button
            Animated.parallel([
                Animated.timing(buttonAnimation, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(positionAnimation, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(positionAnimationFlatList, {
                    toValue: 300, // Adjust this value based on your layout
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [scrollDirection]);

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
                        <Pressable style={ styles.buttonModalSelected }
                                >
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
                        <Pressable style={ styles.buttonModalSelected }
                                >
                            <Text style={styles.textStyle}>{item}</Text>
                            <MaterialIcons name="close" style={styles.iconButton} />
                        </Pressable>}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                />
            </Animated.View>
            {loading ? <ActivityIndicator size="large" color={COLORS.tint} /> :
                <Animated.View style={[styles.flex,{transform: [{ translateY: positionAnimationFlatList }] }]}>
                <FlatList
                    data={food}
                    renderItem={({ item }) => <CardFoodRecipes data={item} route={''} />}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    style={styles.flex}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                /></Animated.View>}

            <AddCategoryModal
                visible={categoryModalVisible}
                onClose={(selectedCategories: string[]) => handleCloseCategoryModal(selectedCategories)} />

            <SelectIngredientList
                modalDataType={'ingredient'}
                visible={ingredientModalVisible}
                onAdd={(item) => { handleCloseIngredientModal(item.name) }}
                onClose={() => setIngredientModalVisible(false)} />

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
