import { StyleSheet, View } from 'react-native'
import { useState, useEffect, useCallback, useRef } from 'react'
import { QueryDocumentSnapshot } from 'firebase/firestore/lite'
import { FoodRecipes } from '../model/model'
import { BackgroundSafeAreaView } from '../components/Common/BackgroundSafeAreaView'
import { CardFoodRecipes } from '../components/Recipes/CardFoodRecipes'
import { SortButton } from '../components/Recipes/SortButton'
import { LoadingScreen } from '../components/Common/LoadingScreen'
import { GetAllFoodRecipes, RecipeSortMode } from '../service/RecipesService'
import { useSortButtonAutoHide } from '../hooks/useSortButtonAutoHide'
import { FlashList } from '@shopify/flash-list'
import { useScrollToTop } from 'expo-router'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { useTranslation } from 'react-i18next'
import { TranslationKeys } from '../locales/_translationKeys'

export default function RecipesScreen() {
    const { t } = useTranslation()
    const [food, setFood] = useState<FoodRecipes[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>()
    const [hasMore, setHasMore] = useState(true)
    const [sortMode, setSortMode] = useState<RecipeSortMode>('newest')
    const listRef = useRef(null)
    useScrollToTop(listRef)

    const fetchData = useCallback(async (currentSortMode: RecipeSortMode) => {
        try {
            const { foodRecipesData, newLastVisible } = await GetAllFoodRecipes(undefined, currentSortMode)
            setFood(foodRecipesData)
            setLastVisible(newLastVisible)
            setHasMore(foodRecipesData.length > 0)
        } catch {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, [t])

    useEffect(() => {
        fetchData(sortMode)
    }, [sortMode, fetchData])

    const handleRefresh = useCallback(() => {
        setRefreshing(true)
        setHasMore(true)
        fetchData(sortMode)
    }, [fetchData, sortMode])

    const handleEndReached = useCallback(async () => {
        if (!hasMore || loadingMore || refreshing) return
        try {
            setLoadingMore(true)
            const { foodRecipesData, newLastVisible } = await GetAllFoodRecipes(lastVisible, sortMode)
            if (foodRecipesData.length > 0) {
                setFood(food => [...food, ...foodRecipesData])
                setLastVisible(newLastVisible)
            } else {
                setHasMore(false)
            }
        } catch {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        } finally {
            setLoadingMore(false)
        }
    }, [hasMore, loadingMore, refreshing, lastVisible, sortMode, t])

    const handleToggleSort = () => {
        setSortMode(current => current === 'newest' ? 'topRated' : 'newest')
    }

    const renderItem = useCallback(({ item }: { item: FoodRecipes }) => (
        <CardFoodRecipes data={item} route={''} />
    ), [])

    const { positionAnimation, handleScroll } = useSortButtonAutoHide()

    if (loading) return <LoadingScreen />

    return (
        <BackgroundSafeAreaView>
            <View style={styles.relativeContainer}>
                <SortButton sortMode={sortMode} onToggle={handleToggleSort} positionAnimation={positionAnimation} />
                <FlashList
                    ref={listRef}
                    data={food}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    style={styles.flex}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                />
            </View>
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
    relativeContainer: {
        flex: 1,
        width: '100%',
    },
    flex: {
        flex: 1,
        width: '100%',
    },
})
