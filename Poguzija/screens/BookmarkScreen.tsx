import { useCallback, useContext, useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { useTranslation } from "react-i18next"
import { UserContext } from "../app/_layout"
import { BackgroundSafeAreaView } from "../components/BackgroundSafeAreaView"
import { CardFoodRecipes } from "../components/CardFoodRecipes"
import { LoadingScreen } from "../components/LoadingScreen"
import { COLORS, SIZES } from "../constants/Colors"
import { TranslationKeys } from "../locales/_translationKeys"
import { FoodRecipes } from "../model/model"
import { GetMySavedFoodRecipes } from "../service/BookmarkService"
import { FlashList } from "@shopify/flash-list"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"

export default function BookmarkScreen() {
    const { user } = useContext(UserContext)
    const [food, setFood] = useState<FoodRecipes[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [lastVisible, setLastVisible] = useState<number>()
    const [hasMore, setHasMore] = useState(true)
    const { t } = useTranslation()

    useEffect(() => {
        if (user) {
            setLoading(true)
            fetchData()
        } else {
            setFood([])
            setLoading(false)
        }
    }, [])

    const fetchData = async () => {
        try {
            const { foodRecipesData, newLastIndex } = await GetMySavedFoodRecipes()
            setFood(foodRecipesData)
            setLastVisible(newLastIndex)
            setHasMore(newLastIndex !== -1)
        } catch (error) {
            console.error('[BookmarkScreen] fetchData failed:', error)
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }

    const handleRefresh = () => {
        setRefreshing(true)
        fetchData()
    }

    const handleEndReached = useCallback(async () => {
        if (!hasMore || loadingMore || refreshing) return
        try {
            setLoadingMore(true)
            const { foodRecipesData, newLastIndex } = await GetMySavedFoodRecipes(lastVisible)
            if (foodRecipesData.length > 0) {
                setFood(food => [...food, ...foodRecipesData])
                setLastVisible(newLastIndex)
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error('[BookmarkScreen] handleEndReached failed:', error)
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
            <Text style={styles.subtitleText}>{t(TranslationKeys.Bookmark.SAVED)}</Text>
            <View style={styles.line} />
            <FlashList
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
        width: '95%'
    },
    line: {
        backgroundColor: COLORS.tint,
        height: SIZES.base,
        width: '95%',
        borderRadius: SIZES.base,
        elevation: 2,
    },
    subtitleText: {
        width: '95%',
        color: COLORS.tint,
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        padding: SIZES.base,
        elevation: 2,
    },
})