import { QueryDocumentSnapshot } from "firebase/firestore/lite"
import { useCallback, useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { Animated, View, StyleSheet, Text, NativeSyntheticEvent, NativeScrollEvent } from "react-native"
import { BackgroundSafeAreaView } from "../components/Common/BackgroundSafeAreaView"
import { CardFoodRecipes } from "../components/Recipes/CardFoodRecipes"
import { FilterChip } from "../components/Common/FilterChip"
import { LoadingScreen } from "../components/Common/LoadingScreen"
import { PillButton } from "../components/Common/PillButton"
import { SearchInput } from "../components/Common/SearchInput"
import { SelectCategoryList } from "../components/IngredientUnitCategory/SelectCategoryList"
import { SelectIngredientsList } from "../components/IngredientUnitCategory/SelectIngredientsList"
import { SIZES, COLORS } from "../constants/Colors"
import { TranslationKeys } from "../locales/_translationKeys"
import { FoodRecipes } from "../model/model"
import { GetSearchResults } from "../service/SearchService"
import GestureRecognizer from 'react-native-swipe-gestures'
import { FlashList } from "@shopify/flash-list"
import { useScrollToTop } from "expo-router"
import { FlatList } from "react-native-gesture-handler"

export default function SearchScreen() {
    const { t } = useTranslation()
    const [food, setFood] = useState<FoodRecipes[]>([])

    const [categoryModalVisible, setCategoryModalVisible] = useState(false)
    const [ingredientModalVisible, setIngredientModalVisible] = useState(false)

    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [ingredientData, setIngredientData] = useState<string[]>([])
    const [categoryData, setCategoryData] = useState<string[]>([])
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>()
    const [hasMore, setHasMore] = useState(true)
    const [emptyResult, setEmptyResult] = useState(false)
    const listRef = useRef(null)
    useScrollToTop(listRef)

    const handleCloseCategoryModal = (selectedCategories: string[]) => {
        setCategoryModalVisible(false)
        setCategoryData(selectedCategories)
    }

    const handleCloseIngredientModal = (selectedIngredients: string[]) => {
        setIngredientData(selectedIngredients)
        setIngredientModalVisible(false)
    }

    const handleSearch = async () => {
        if (loading) return
        setLoading(true)
        setEmptyResult(false)
        const searchData = search.toUpperCase().split(/[\s-\.,!?]/).filter(t => t.length >= 4)
        const searchParams = [...categoryData, ...ingredientData, ...searchData]

        if (searchParams.length === 0) {
            setLoading(false)
            return
        }

        if (searchParams.length > 10) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: t(TranslationKeys.Search.TOO_MANY_FILTERS)
            })
        }

        try {
            const { foodRecipesData, newLastVisible } = await GetSearchResults(searchParams, null)
            setFood(foodRecipesData)
            setLastVisible(newLastVisible)
            setHasMore(foodRecipesData.length > 0)
            setEmptyResult(foodRecipesData.length === 0)
            setScrollDirection(foodRecipesData.length === 0 ? 'up' : 'down')
        } catch {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        } finally {
            setLoading(false)
        }
    }

    const handleEndReached = useCallback(async () => {
        if (!hasMore) return
        const searchData = search.toUpperCase().split(/[\s-\.,!?]/).filter(t => t.length >= 4)
        const searchParams = [...categoryData, ...ingredientData, ...searchData]

        if (searchParams.length === 0) {
            return
        }
        try {
            const { foodRecipesData, newLastVisible } = await GetSearchResults(searchParams, lastVisible)
            if (foodRecipesData.length > 0) {
                setFood([...food, ...foodRecipesData])
                setLastVisible(newLastVisible)
            } else {
                setHasMore(false)
            }
        } catch {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        }
    }, [hasMore, search, categoryData, ingredientData, lastVisible, food, t])

    const onDeleteSelected = useCallback((type: string, selectedItem: string) => {
        if (type === 'ingredient') {
            setIngredientData(ingredientData => ingredientData.filter((item) => item !== selectedItem))
        }
        if (type === 'category') {
            setCategoryData(categoryData => categoryData.filter((item) => item !== selectedItem))
        }
    }, [])

    const renderCategoryItem = useCallback(({ item }: { item: string }) => (
        <FilterChip
            label={t(TranslationKeys.CategoryItem[item as keyof typeof TranslationKeys.CategoryItem]) || item}
            onPress={() => onDeleteSelected('category', item)} />
    ), [onDeleteSelected, t])

    const renderIngredientItem = useCallback(({ item }: { item: string }) => (
        <FilterChip
            label={t(TranslationKeys.IngredientItem[item as keyof typeof TranslationKeys.IngredientItem]) || item}
            onPress={() => onDeleteSelected('ingredient', item)} />
    ), [onDeleteSelected, t])

    const renderFoodItem = useCallback(({ item }: { item: FoodRecipes }) => (
        <CardFoodRecipes data={item} route={''} />
    ), [])

    const [scrollDirection, setScrollDirection] = useState('')
    const positionAnimation = useRef(new Animated.Value(0)).current

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollPos = event.nativeEvent.contentOffset.y
        if (currentScrollPos > 0) {
            setScrollDirection('down')
        } else if (currentScrollPos <= 0) {
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
                <Animated.View style={[styles.animatedContainer, { transform: [{ translateY: positionAnimation }] }]}>
                    <SearchInput
                        value={search}
                        onChangeText={text => setSearch(text)} />
                    <PillButton onPress={() => setCategoryModalVisible(true)}>{t(TranslationKeys.Search.SELECT_CATEGORY)}</PillButton>
                    <PillButton onPress={() => setIngredientModalVisible(true)}>{t(TranslationKeys.Search.SELECT_INGREDIENT)}</PillButton>
                    <PillButton onPress={() => handleSearch()}>{t(TranslationKeys.Button.SEARCH)}</PillButton>
                    <FlatList
                        data={categoryData}
                        style={styles.flex}
                        contentContainerStyle={[{ alignContent: 'flex-start' }]}
                        renderItem={renderCategoryItem}
                        keyExtractor={(item) => item}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                    />
                    <FlatList
                        data={ingredientData}
                        style={styles.flex}
                        contentContainerStyle={[{ alignContent: 'flex-start' }]}
                        renderItem={renderIngredientItem}
                        keyExtractor={(item) => item}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                    />
                    {emptyResult && <Text style={styles.emptyText}>{t(TranslationKeys.Search.NO_RESULTS)}</Text>}
                </Animated.View>
                {loading ? <LoadingScreen /> :
                    <GestureRecognizer style={styles.flex} onSwipeDown={(state) => { if (food.length !== 0) { setScrollDirection('up') } }} onSwipeUp={(state) => { if (food.length !== 0) { setScrollDirection('down') } }} >
                        <View style={[styles.flex]}>
                            <FlashList
                                ref={listRef}
                                data={food}
                                renderItem={renderFoodItem}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                style={styles.flex}
                                onScroll={handleScroll}
                                scrollEventThrottle={16}
                                onEndReached={handleEndReached}
                                onEndReachedThreshold={0.5}
                            />
                        </View>
                    </GestureRecognizer>}

                <SelectCategoryList
                    alreadySelected={categoryData}
                    visible={categoryModalVisible}
                    onClose={(selectedCategories: string[]) => handleCloseCategoryModal(selectedCategories)} />

                <SelectIngredientsList
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
        width: '100%',
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
    emptyText: {
        color: COLORS.tint,
        fontSize: SIZES.large,
        paddingTop: SIZES.base,
    },
})
