import { useLocalSearchParams, useRouter } from 'expo-router'
import BackgroundSafeAreaView from '../../../components/BackgroundSafeAreaView'
import { useContext, useEffect, useState } from 'react'
import { View,  Pressable, Text, StyleSheet, Image, Dimensions } from 'react-native'
import { FoodRecipes } from '../../../model/model'
import Carousel from 'react-native-snap-carousel'
import { COLORS, SIZES } from '../../../constants/Colors'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import LoadingScreen from '../../../components/LoadingScreen'
import { GetFoodRecipe, UpdateSavedCount } from '../../../service/RecipesService'
import { UserContext } from '../../_layout'
import { LinearGradient } from 'expo-linear-gradient'
import { AddToMyBookmark, IsRecipeBookmarked, RemoveFromMyBookmark } from '../../../service/BookmarkService'


export default function FoodRecipesItem() {
    const { foodRecipesItemId } = useLocalSearchParams<{ foodRecipesItemId: string }>()
    const { user } = useContext(UserContext)
    const [food, setFood] = useState<FoodRecipes>()
    const [loading, setLoading] = useState(true)
    const [bookmarkIconType, setBookmarkIconType] = useState('bookmark-o')
    const [isRecipeBookmarked, setIsRecipeBookmarked] = useState(false)
    const [savedCount, setSavedCount] = useState(0)

    const router = useRouter()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const foodRecipesData = await GetFoodRecipe(foodRecipesItemId)
            const isRecipeBookmarkedData = await IsRecipeBookmarked(foodRecipesItemId)
            setFood(foodRecipesData)
            if(isRecipeBookmarkedData){
                setBookmarkIconType('bookmark')
                setIsRecipeBookmarked(true)
            }else{
                setBookmarkIconType('bookmark-o')
                setIsRecipeBookmarked(false)
            }
            setSavedCount(foodRecipesData.savedCount || 0)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }
    
    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height

    const handleAddToBookmarks = () => {
        if(isRecipeBookmarked){
            RemoveFromMyBookmark(foodRecipesItemId)
            UpdateSavedCount(foodRecipesItemId, false)
            setSavedCount(savedCount === 0 ? 0 : savedCount - 1)
            setBookmarkIconType('bookmark-o')
            setIsRecipeBookmarked(false)
        }else{
            AddToMyBookmark(foodRecipesItemId)
            UpdateSavedCount(foodRecipesItemId, true)
            setSavedCount(savedCount + 1)
            setBookmarkIconType('bookmark')
            setIsRecipeBookmarked(true)
        }
    }

    const handleOpenComments = () => {
        router.push(`/comments/${foodRecipesItemId}`)
    }
    
    const renderItem = ({ item }: { item: string }) => {
        return (
            <View style={[styles.images, { width: screenWidth, height: 2 * screenHeight / 3 }]} >
                <Image source={{ uri: item }} style={[styles.image, { width: screenWidth, height: 2 * screenHeight / 3 }]} />
                <LinearGradient 
                    colors={['rgba(0, 0, 0, 0.8)', 'rgba(255, 255, 255, 0)' ]} 
                    start={{ x: 0.5, y: - 0.2 }}
                    end={{ x: 0.5, y: 0.15 }}
                    style={[styles.gradientTop, { ...StyleSheet.absoluteFillObject }]} />
                <LinearGradient 
                    colors={['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.8)' ]} 
                    start={{ x: 0.5, y: 0.8 }}
                    end={{ x: 0.5, y: 1.1 }}
                    style={[styles.gradientBottom, { ...StyleSheet.absoluteFillObject }]} />
            </View>
        )
    }

    if (loading) return <LoadingScreen />
    
    return (
        <BackgroundSafeAreaView>
            <View style={styles.scrollViewContent}>
                <View style={[styles.flex, { flexDirection: 'row'}]}>
                    <Carousel
                        data={food?.images}
                        renderItem={renderItem}
                        sliderWidth={screenWidth}
                        itemWidth={screenWidth}
                        layout="default"
                    />
                    
                {user && 
                <View style={styles.bookmarkContainer}>
                    <Text style={styles.savedCount}>{savedCount}</Text>
                    <FontAwesome name={bookmarkIconType} color={COLORS.light} size={1.2 * SIZES.tabIcon} onPress={handleAddToBookmarks}/>
                </View>}
                </View>

                <BottomSheet
                    snapPoints={['35', '65', '95']}
                    backgroundStyle={{ backgroundColor: COLORS.dark }} >
                    <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.subtitleText}>Recipe name</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="receipt" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                multiline={true}
                                placeholder="Recipe name"
                                value={food?.title}
                                autoComplete='off'
                                editable={false}
                            />
                        </View>

                        <Text style={styles.subtitleText}>Time to prepare</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="people" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder="Time to prepare"
                                value={food?.cookingTime}
                                editable={false}
                            />
                        </View>

                        <Text style={styles.subtitleText}>Serving size</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="people" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder="Serving size"
                                value={food?.servingSize}
                                editable={false}
                            />
                        </View>

                        <Text style={styles.subtitleText}>Ingredients</Text>
                        {food?.ingredients?.map((ingredient, index) => (
                            <View key={index} style={styles.ingredientItem}>
                                <Text style={[styles.textInput, { width: "auto" }]}>   {ingredient.name}   -   {ingredient.amount} {ingredient.unit}</Text>
                            </View>
                        ))}

                        <Text style={styles.subtitleText}>Cooking instructions</Text>
                        {food?.steps?.map((step, index) => (
                            <BottomSheetTextInput
                                style={styles.input}
                                multiline={true}
                                value={`${step.number}. ${step.description}`}
                                key={step.number}
                                editable={false}
                            />
                        ))}
                        <Pressable style={styles.button} onPress={handleOpenComments}>
                            <Text style={styles.buttonText}>Show reviews</Text>
                        </Pressable>
                    </BottomSheetScrollView>
                </BottomSheet>

            </View>
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
    },
    scrollViewContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    images: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SIZES.extraLarge
    },
    image: {
        borderTopLeftRadius: SIZES.extraLarge,
        borderTopRightRadius: SIZES.extraLarge,
        marginTop: SIZES.extraLarge
    },
    gradientTop: {
        borderTopLeftRadius: SIZES.extraLarge,
        borderTopRightRadius: SIZES.extraLarge,
        marginTop: SIZES.small
    },
    gradientBottom: {
        borderTopLeftRadius: SIZES.extraLarge,
        borderTopRightRadius: SIZES.extraLarge,
        marginBottom: - SIZES.small
    },
    input: {
        width: '95%',
        minHeight: 60,
        backgroundColor: COLORS.light,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        padding: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large
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
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: SIZES.large,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        minHeight: 60,
        backgroundColor: COLORS.light,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        padding: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    textInput: {
        width: '88%',
        marginRight: 10,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    icon: {
        marginRight: 10,
        color: COLORS.lightDark,
        fontSize: SIZES.extraLarge
    },
    subtitleText: {
        width: '85%',
        color: COLORS.tint,
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        marginBottom: SIZES.base,
        marginTop: SIZES.small
    },
    ingredientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        height: 60,
        backgroundColor: COLORS.light,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    bookmarkContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 'auto',
        position: 'absolute',
        top: SIZES.extraLarge,
        right: SIZES.extraLarge,
        paddingTop: SIZES.base
    },
    savedCount: {
        color: COLORS.light,
        fontSize: SIZES.large,
        fontWeight: 'bold',
        marginEnd: SIZES.base,
        textAlignVertical: 'center'
    },
})