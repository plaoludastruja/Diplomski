import { useCallback, useEffect, useRef, useState } from "react"
import { Animated, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from "react-native"
import { Image } from "expo-image"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useTranslation } from "react-i18next"
import { QueryDocumentSnapshot } from "firebase/firestore/lite"
import { FlashList } from "@shopify/flash-list"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { BackgroundSafeAreaView } from "../components/Common/BackgroundSafeAreaView"
import { CardFoodRecipes } from "../components/Recipes/CardFoodRecipes"
import { SortButton } from "../components/Recipes/SortButton"
import { Divider } from "../components/Common/Divider"
import { LoadingScreen } from "../components/Common/LoadingScreen"
import { SubtitleText } from "../components/Common/SubtitleText"
import { SIZES } from "../constants/Colors"
import { TranslationKeys } from "../locales/_translationKeys"
import { FoodRecipes, MyUser } from "../model/model"
import { GetFoodRecipesByAuthor, RecipeSortMode } from "../service/RecipesService"
import { GetUser } from "../service/UserService"

export default function AuthorRecipesScreen() {
    const { authorId } = useLocalSearchParams<{ authorId: string }>()
    const router = useRouter()
    const { t } = useTranslation()
    const [author, setAuthor] = useState<MyUser>()
    const [food, setFood] = useState<FoodRecipes[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>()
    const [hasMore, setHasMore] = useState(true)
    const [sortMode, setSortMode] = useState<RecipeSortMode>('newest')

    const fetchData = useCallback(async (currentSortMode: RecipeSortMode) => {
        try {
            const authorData = await GetUser(authorId)
            if (!authorData) {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: t(TranslationKeys.Error.LOADING_FAILED)
                })
                router.back()
                return
            }
            setAuthor(authorData)
            const { foodRecipesData, newLastVisible } = await GetFoodRecipesByAuthor(authorId, null, currentSortMode)
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
    }, [authorId, router, t])

    useEffect(() => {
        fetchData(sortMode)
    }, [sortMode, fetchData])

    const handleRefresh = () => {
        setRefreshing(true)
        fetchData(sortMode)
    }

    const handleEndReached = useCallback(async () => {
        if (!hasMore || loadingMore || refreshing) return
        try {
            setLoadingMore(true)
            const { foodRecipesData, newLastVisible } = await GetFoodRecipesByAuthor(authorId, lastVisible, sortMode)
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
    }, [hasMore, loadingMore, refreshing, lastVisible, authorId, sortMode, t])

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
        <BackgroundSafeAreaView>
            <View style={styles.header}>
                <Image source={{ uri: author?.profilePhoto }} style={styles.avatar} contentFit="cover" transition={300} />
                <SubtitleText style={styles.name}>{author?.name}</SubtitleText>
            </View>
            <Divider />
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
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
    relativeContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        overflow: 'hidden',
    },
    flex: {
        flex: 1,
        width: '95%',
    },
    header: {
        alignItems: 'center',
        width: '95%',
    },
    avatar: {
        width: 2.5 * SIZES.tabIcon,
        height: 2.5 * SIZES.tabIcon,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.base,
    },
    name: {
        width: 'auto',
        textAlign: 'center',
    },
})
