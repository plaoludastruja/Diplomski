import { StyleSheet, RefreshControl } from 'react-native'
import { useCallback, useContext, useEffect, useState } from 'react'
import { FoodRecipes } from '../model/model'
import { UserContext } from '../app/_layout'
import { CardFoodRecipes } from './CardFoodRecipes'
import { GetMyFoodRecipes } from '../service/RecipesService'
import { LoadingScreen } from './LoadingScreen'
import { QueryDocumentSnapshot } from 'firebase/firestore/lite'
import { FlashList } from '@shopify/flash-list'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { useTranslation } from 'react-i18next'
import { TranslationKeys } from '../locales/_translationKeys'

export const MyRecipes = () => {
    const { user } = useContext(UserContext)
    const { t } = useTranslation()
    const [food, setFood] = useState<FoodRecipes[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>()
    const [hasMore, setHasMore] = useState(true)
    
    const fetchData = useCallback(async () => {
        try {
            const { foodRecipesData, newLastVisible }  = await GetMyFoodRecipes(null)
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
        if(user){
            setLoading(true)
            fetchData()
        }else{
            setFood([])
            setLoading(false)
        }
    },[user, fetchData])
    
    const handleRefresh = () => {
        setRefreshing(true)
        fetchData()
    }

    const handleEndReached = useCallback(async () => {
        if (!hasMore) return
        try {
            const { foodRecipesData, newLastVisible } = await GetMyFoodRecipes(lastVisible)
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
    }, [hasMore, lastVisible, food, t])
    
    const renderItem = useCallback(({ item }: { item: FoodRecipes }) => (
        <CardFoodRecipes data={item} route={''} />
    ), [])

    if (loading) return <LoadingScreen />

    return (
        <FlashList
            data={food}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            style={styles.flex}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
        />
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '100%',
    },
})
