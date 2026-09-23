import { useCallback, useContext, useEffect, useState } from "react"
import { useLocalSearchParams } from "expo-router"
import { Animated, Pressable, View, StyleSheet, RefreshControl, useAnimatedValue } from "react-native"
import { QueryDocumentSnapshot } from "firebase/firestore/lite"
import { MaterialIcons } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { UserContext } from "../app/_layout"
import { Comment, MyUser } from "../model/model"
import { AddCommentModal } from "../components/Comment/AddCommentModal"
import { BackgroundSafeAreaView } from "../components/Common/BackgroundSafeAreaView"
import { CardComment } from "../components/Comment/CardComment"
import { LoadingScreen } from "../components/Common/LoadingScreen"
import { Divider } from "../components/Common/Divider"
import { SubtitleText } from "../components/Common/SubtitleText"
import { COLORS, SIZES } from "../constants/Colors"
import { TranslationKeys } from "../locales/_translationKeys"
import { GetCommentsForRecipe, AddComment } from "../service/CommentService"
import { UpdateRecipeRating } from "../service/RecipesService"
import { GetUsers } from "../service/UserService"
import { FlashList } from "@shopify/flash-list"

export default function CommentsScreen() {
    const { commentRecipeId } = useLocalSearchParams<{ commentRecipeId: string }>()
    const { user } = useContext(UserContext)
    const [comments, setComments] = useState<Comment[]>([])
    const [authors, setAuthors] = useState<Map<string, MyUser>>(new Map())
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot>()
    const [hasMore, setHasMore] = useState(true)
    const [addCommentModalVisible, setAddCommentModalVisible] = useState(false)
    const { t } = useTranslation()
    const addButtonScale = useAnimatedValue(1)

    const handleAddButtonPressIn = () => {
        Animated.spring(addButtonScale, { toValue: 0.9, useNativeDriver: true }).start()
    }

    const handleAddButtonPressOut = () => {
        Animated.spring(addButtonScale, { toValue: 1, useNativeDriver: true }).start()
    }

    const loadAuthors = async (commentsData: Comment[]) => {
        const authorIds = commentsData.map((comment) => comment.authorId).filter(Boolean)
        const newAuthors = await GetUsers(authorIds)
        setAuthors((prevAuthors) => new Map([...prevAuthors, ...newAuthors]))
    }

    const fetchData = async () => {
        try {
            const { commentsData, newLastVisible } = await GetCommentsForRecipe(commentRecipeId, undefined)
            setComments(commentsData)
            setLastVisible(newLastVisible ?? undefined)
            setHasMore(commentsData.length > 0)
            await loadAuthors(commentsData)
        } catch {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleRefresh = () => {
        setRefreshing(true)
        setHasMore(true)
        fetchData()
    }

    const handleEndReached = useCallback(async () => {
        if (!hasMore || loadingMore || refreshing) return
        try {
            setLoadingMore(true)
            const { commentsData, newLastVisible } = await GetCommentsForRecipe(commentRecipeId, lastVisible)
            if (commentsData.length > 0) {
                setComments((prevComments) => [...prevComments, ...commentsData])
                setLastVisible(newLastVisible ?? undefined)
                await loadAuthors(commentsData)
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
    }, [hasMore, loadingMore, refreshing, lastVisible, commentRecipeId, t])

    const onAddNewComment = async (text: string, rating: number) => {
        setAddCommentModalVisible(false)
        try {
            if (text !== '') {
                const comment: Partial<Comment> = {
                    authorId: user?.id || '',
                    text: text
                }
                await AddComment(commentRecipeId, comment)
            }

            if (rating !== 0) {
                await UpdateRecipeRating(commentRecipeId, rating)
            }
        } catch {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        }
    }

    const renderItem = useCallback(({ item }: { item: Comment }) => (
        <CardComment commentData={item} author={authors.get(item.authorId)} />
    ), [authors])

    if (loading) return <LoadingScreen />

    return (
        <BackgroundSafeAreaView>
            <View>
                <View style={styles.header}>
                    <SubtitleText>{t(TranslationKeys.Review.REVIEWS)}</SubtitleText>
                    {user ?
                        <Animated.View style={[styles.addButton, { transform: [{ scale: addButtonScale }] }]}>
                            <Pressable onPress={() => setAddCommentModalVisible(true)} onPressIn={handleAddButtonPressIn} onPressOut={handleAddButtonPressOut}>
                                <MaterialIcons name="add" style={styles.icon} />
                            </Pressable>
                        </Animated.View> : <View />}
                </View>
            </View>
            <Divider />
            <FlashList
                data={comments}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={styles.flex}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />
            <AddCommentModal
                visible={addCommentModalVisible}
                onAdd={onAddNewComment}
                onClose={() => setAddCommentModalVisible(false)} />
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
    },
    addButton: {
        backgroundColor: COLORS.tint,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.base,
        elevation: 2,
    },
    icon: {
        color: COLORS.white,
        fontSize: SIZES.extraLarge,
    },
    flex: {
        flex: 1,
        width: '95%',
    },
})
