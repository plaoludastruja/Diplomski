import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../_layout"
import { useLocalSearchParams } from "expo-router"
import BackgroundSafeAreaView from "../../../components/BackgroundSafeAreaView"
import { FlatList, Pressable, View, Text, StyleSheet, RefreshControl } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import LoadingScreen from "../../../components/LoadingScreen"
import { COLORS, SIZES } from "../../../constants/Colors"
import { AddComment, GetCommentsForRecipe } from "../../../service/CommentService"
import { Comment } from "../../../model/model"
import { CardComment } from "../../../components/CardComment"
import { AddCommentModal } from "../../../components/AddCommentModal"
import { UpdateRecipeRating } from "../../../service/RecipesService"

export default function CommentsScreen() {
    const { commentRecipeId } = useLocalSearchParams<{ commentRecipeId: string }>()
    const { user } = useContext(UserContext)
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [addCommentModalVisible, setAddCommentModalVisible] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const commentsData = await GetCommentsForRecipe(commentRecipeId)
            setComments(commentsData)
            setLoading(false)
            setRefreshing(false)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

    const handleRefresh = () => {
        setRefreshing(true)
        fetchData()
    }

    const onAddNewComment = (text: string, rating: number) => {
        setAddCommentModalVisible(false)
        if(text != ''){
            const comment: Partial<Comment> = {
                authorName: user?.fullName || '',
                authorProfilePhoto: user?.profilePhoto || '',
                text: text
            }
            
            comment.authorName = user?.fullName
            comment.authorProfilePhoto = user?.profilePhoto
            AddComment(commentRecipeId, comment)
        }
        
        if(rating != 0){
            UpdateRecipeRating(commentRecipeId, rating)
        }
    }

    if (loading) return <LoadingScreen />

    return (
        <BackgroundSafeAreaView>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.subtitleText}>Reviews</Text>
                    { user ? 
                    <Pressable style={styles.addButton} onPress={() => setAddCommentModalVisible(true)}>
                        <MaterialIcons name="add" style={styles.icon}  />
                    </Pressable> : <View / >}
                </View>
            </View>
            <View style={styles.line} />
            <FlatList
                data={comments}
                renderItem={({ item }) => <CardComment commentData={item} />}
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
                visible={ addCommentModalVisible } 
                onAdd={onAddNewComment} 
                onClose={() => setAddCommentModalVisible(false)} />
            
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
    
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: SIZES.large,
    },
    button: {
        textAlign: 'center',
        justifyContent: 'center',
        width: '85%',
        backgroundColor: COLORS.tint,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.base,
        marginVertical: SIZES.base,
        elevation: 2,
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    header: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        
        padding: SIZES.base,
    },
    addButton: {
        backgroundColor: COLORS.tint,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.base,
        elevation: 2,
    },
    icon: {
        color: COLORS.white,
        fontSize: SIZES.extraLarge
    },    
    line: {
        backgroundColor: COLORS.tint,
        height: SIZES.base,
        width: '95%',
        borderRadius: SIZES.base,
        elevation: 2,
    },
    flex: {
        flex: 1,
        width: '95%',
    },
    subtitleText: {
        width: '85%',
        color: COLORS.tint,
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        marginBottom: 0.5 * SIZES.base,
        marginTop: SIZES.small,
    },
})