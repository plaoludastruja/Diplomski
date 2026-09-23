import { useCallback, useContext, useEffect, useState } from "react"
import { StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { UserContext } from "../app/_layout"
import { BackgroundSafeAreaView } from "../components/Common/BackgroundSafeAreaView"
import { CardFoodRecipes } from "../components/Recipes/CardFoodRecipes"
import { LoadingScreen } from "../components/Common/LoadingScreen"
import { Divider } from "../components/Common/Divider"
import { SubtitleText } from "../components/Common/SubtitleText"
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

    const fetchData = async () => {
        try {
            const { foodRecipesData, newLastIndex } = await GetMySavedFoodRecipes()
            setFood(foodRecipesData)
            setLastVisible(newLastIndex)
            setHasMore(newLastIndex !== -1)
        } catch {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            setLoading(true)
            fetchData()
        } else {
            setFood([])
            setLoading(false)
        }
    }, [user])

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
        } catch {
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
            <SubtitleText>{t(TranslationKeys.Bookmark.SAVED)}</SubtitleText>
            <Divider />
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
        width: '95%',
    },
})
