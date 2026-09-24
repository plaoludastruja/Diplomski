import { Animated, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FoodRecipes } from '../../model/model'
import { UserContext } from '../../app/_layout'
import { CardFoodRecipes } from '../Recipes/CardFoodRecipes'
import { SortButton } from '../Recipes/SortButton'
import { GetMyFoodRecipes, RecipeSortMode } from '../../service/RecipesService'
import { LoadingScreen } from '../Common/LoadingScreen'
import { QueryDocumentSnapshot } from 'firebase/firestore/lite'
import { FlashList } from '@shopify/flash-list'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { useTranslation } from 'react-i18next'
import { TranslationKeys } from '../../locales/_translationKeys'

export const MyRecipes = () => {
    const { user } = useContext(UserContext)
    const { t } = useTranslation()
    const [food, setFood] = useState<FoodRecipes[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>()
    const [hasMore, setHasMore] = useState(true)
    const [sortMode, setSortMode] = useState<RecipeSortMode>('newest')

    const fetchData = useCallback(async (currentSortMode: RecipeSortMode) => {
        try {
            const { foodRecipesData, newLastVisible } = await GetMyFoodRecipes(null, currentSortMode)
            setFood(foodRecipesData)
            setLastVisible(newLastVisible)
            setHasMore(foodRecipesData.length > 0)
        } catch {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        } finally {
            setRefreshing(false)
            setLoading(false)
        }
    }, [t])

    useEffect(() => {
        if (user) {
            setLoading(true)
            fetchData(sortMode)
        } else {
            setFood([])
            setLoading(false)
        }
    }, [user, sortMode, fetchData])

    const handleRefresh = () => {
        setRefreshing(true)
        fetchData(sortMode)
    }

    const handleEndReached = useCallback(async () => {
        if (!hasMore || loadingMore || refreshing) return
        try {
            setLoadingMore(true)
            const { foodRecipesData, newLastVisible } = await GetMyFoodRecipes(lastVisible, sortMode)
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

    const [scrollDirection, setScrollDirection] = useState('')
    const [positionAnimation] = useState(() => new Animated.Value(0))
    const lastScrollY = useRef(0)

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollPos = event.nativeEvent.contentOffset.y
        if (currentScrollPos <= 0) {
            setScrollDirection('up')
        } else if (currentScrollPos > lastScrollY.current) {
            setScrollDirection('down')
        } else if (currentScrollPos < lastScrollY.current) {
            setScrollDirection('up')
        }
        lastScrollY.current = currentScrollPos
    }

    useEffect(() => {
        Animated.timing(positionAnimation, {
            toValue: scrollDirection === 'down' ? -200 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start()
    }, [scrollDirection, positionAnimation])

    if (loading) return <LoadingScreen />

    return (
        <View style={styles.relativeContainer}>
            <SortButton sortMode={sortMode} onToggle={handleToggleSort} positionAnimation={positionAnimation} />
            <FlashList
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
    )
}

const styles = StyleSheet.create({
    relativeContainer: {
        flex: 1,
        width: '100%',
        overflow: 'hidden',
    },
    flex: {
        flex: 1,
        width: '100%',
    },
})
