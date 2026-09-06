import { useCallback, useContext, useEffect, useState } from "react"
import { useLocalSearchParams } from "expo-router"
import { Animated, Pressable, View, Text, StyleSheet, RefreshControl, useAnimatedValue } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"
import { UserContext } from "../app/_layout"
import { Comment } from "../model/model"
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
import { FlashList } from "@shopify/flash-list"

export default function CommentsScreen() {
    const { commentRecipeId } = useLocalSearchParams<{ commentRecipeId: string }>()
    const { user } = useContext(UserContext)
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [addCommentModalVisible, setAddCommentModalVisible] = useState(false)
    const { t } = useTranslation()
    const addButtonScale = useAnimatedValue(1)

    const handleAddButtonPressIn = () => {
        Animated.spring(addButtonScale, { toValue: 0.9, useNativeDriver: true }).start()
    }

    const handleAddButtonPressOut = () => {
        Animated.spring(addButtonScale, { toValue: 1, useNativeDriver: true }).start()
    }

    const fetchData = async () => {
        try {
            const commentsData = await GetCommentsForRecipe(commentRecipeId)
            setComments(commentsData)
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
        fetchData()
    }

    const onAddNewComment = (text: string, rating: number) => {
        setAddCommentModalVisible(false)
        if (text !== '') {
            const comment: Partial<Comment> = {
                authorName: user?.fullName || '',
                authorProfilePhoto: user?.profilePhoto || '',
                text: text
            }
            AddComment(commentRecipeId, comment)
        }

        if (rating !== 0) {
            UpdateRecipeRating(commentRecipeId, rating)
        }
    }

    const renderItem = useCallback(({ item }: { item: Comment }) => (
        <CardComment commentData={item} />
    ), [])

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
