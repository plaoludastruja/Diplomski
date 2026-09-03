import { StyleSheet } from 'react-native'
import { useState, useEffect, useCallback, useRef } from 'react'
import { QueryDocumentSnapshot } from 'firebase/firestore/lite'
import { FoodRecipes } from '../model/model'
import { BackgroundSafeAreaView } from '../components/BackgroundSafeAreaView'
import { CardFoodRecipes } from '../components/CardFoodRecipes'
import { LoadingScreen } from '../components/LoadingScreen'
import { GetAllFoodRecipes } from '../service/RecipesService'
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
    const listRef = useRef(null)
    useScrollToTop(listRef)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const { foodRecipesData, newLastVisible } = await GetAllFoodRecipes(undefined)
            setFood(foodRecipesData)
            setLastVisible(newLastVisible)
            setHasMore(foodRecipesData.length > 0)
        } catch (error) {
            console.error('[RecipesScreen] fetchData failed:', error)
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }

    const handleRefresh = useCallback(() => {
        setRefreshing(true)
        setHasMore(true)
        fetchData()
    }, [])

    const handleEndReached = useCallback(async () => {
        if (!hasMore || loadingMore || refreshing) return
        try {
            setLoadingMore(true)
            const { foodRecipesData, newLastVisible } = await GetAllFoodRecipes(lastVisible)
            if (foodRecipesData.length > 0) {
                setFood(food => [...food, ...foodRecipesData])
                setLastVisible(newLastVisible)
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error('[RecipesScreen] handleEndReached failed:', error)
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        } finally {
            setLoadingMore(false)
        }
    }, [hasMore, loadingMore, refreshing, lastVisible, t])

    const renderItem = useCallback(({ item }: { item: FoodRecipes }) => (
        <CardFoodRecipes data={item} route={''} />
    ), [])

    if (loading) return <LoadingScreen />

    return (
        <BackgroundSafeAreaView>
            <FlashList
                ref={listRef}
                data={food}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.flex}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
            />
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '100%',
    },
})
