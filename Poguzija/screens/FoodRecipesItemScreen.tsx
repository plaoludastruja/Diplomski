import { useLocalSearchParams, useRouter } from 'expo-router'
import { useContext, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native'
import { Image } from 'expo-image'
import Carousel from 'react-native-snap-carousel'
import { FontAwesome, FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { LinearGradient } from 'expo-linear-gradient'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { useTranslation } from 'react-i18next'
import { UserContext, SchedulerContext } from '../app/_layout'
import { BackgroundSafeAreaView } from '../components/Common/BackgroundSafeAreaView'
import { ConfirmBottomSheet, ConfirmBottomSheetRef } from '../components/Common/ConfirmBottomSheet'
import { LoadingScreen } from '../components/Common/LoadingScreen'
import { OptionsBottomSheet, OptionsBottomSheetRef } from '../components/Common/OptionsBottomSheet'
import { PillButton } from '../components/Common/PillButton'
import { SelectWeekModal } from '../components/Recipes/SelectWeekModal'
import { SubtitleText } from '../components/Common/SubtitleText'
import { COLORS, SIZES } from '../constants/Colors'
import { TranslationKeys } from '../locales/_translationKeys'
import { FoodRecipes, Day, MyUser } from '../model/model'
import { IsRecipeBookmarked, RemoveFromMyBookmark, AddToMyBookmark } from '../service/BookmarkService'
import { GetFoodRecipe, UpdateSavedCount, DeleteFoodRecipe } from '../service/RecipesService'
import { AddToMyScheduler } from '../service/SchedulerService'
import { GetUser } from '../service/UserService'

export default function FoodRecipesItemScreen() {
    const { foodRecipesItemId } = useLocalSearchParams<{ foodRecipesItemId: string }>()
    const { user } = useContext(UserContext)
    const { setRefreshScheduler } = useContext(SchedulerContext)
    const [food, setFood] = useState<FoodRecipes>()
    const [author, setAuthor] = useState<MyUser>()
    const [loading, setLoading] = useState(true)
    const [bookmarkIconType, setBookmarkIconType] = useState<'bookmark' | 'bookmark-o'>('bookmark-o')
    const [isRecipeBookmarked, setIsRecipeBookmarked] = useState(false)
    const [savedCount, setSavedCount] = useState(0)
    const [selectWeekModalVisible, setSelectWeekModalVisible] = useState(false)
    const { t } = useTranslation()
    const optionsSheetRef = useRef<OptionsBottomSheetRef>(null)
    const confirmDeleteSheetRef = useRef<ConfirmBottomSheetRef>(null)

    const router = useRouter()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const foodRecipesData = await GetFoodRecipe(foodRecipesItemId)
            if (!foodRecipesData) {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: t(TranslationKeys.Error.LOADING_FAILED)
                })
                router.back()
                return
            }
            const isRecipeBookmarkedData = await IsRecipeBookmarked(foodRecipesItemId)
            setFood(foodRecipesData)
            if (foodRecipesData.author) {
                GetUser(foodRecipesData.author).then(setAuthor).catch(() => { })
            }
            if (isRecipeBookmarkedData) {
                setBookmarkIconType('bookmark')
                setIsRecipeBookmarked(true)
            } else {
                setBookmarkIconType('bookmark-o')
                setIsRecipeBookmarked(false)
            }
            setSavedCount(foodRecipesData.savedCount || 0)
        } catch {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        } finally {
            setLoading(false)
        }
    }

    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height

    const timeDisplay = () => {
        if (!food?.cookingTime) {
            return
        }
        else if (food?.cookingTime?.hours !== '' && food?.cookingTime?.minutes !== '') {
            return `${food?.cookingTime?.hours} h ${food?.cookingTime?.minutes} min`
        } else if (food?.cookingTime?.hours !== '') {
            return `${food?.cookingTime?.hours} h`
        } else if (food?.cookingTime?.minutes !== '') {
            return `${food?.cookingTime?.minutes} min`
        } else {
            return '0 min'
        }
    }

    const handleAddToBookmarks = () => {
        if (isRecipeBookmarked) {
            RemoveFromMyBookmark(foodRecipesItemId)
            UpdateSavedCount(foodRecipesItemId, false)
            setSavedCount(savedCount === 0 ? 0 : savedCount - 1)
            setBookmarkIconType('bookmark-o')
            setIsRecipeBookmarked(false)
        } else {
            AddToMyBookmark(foodRecipesItemId)
            UpdateSavedCount(foodRecipesItemId, true)
            setSavedCount(savedCount + 1)
            setBookmarkIconType('bookmark')
            setIsRecipeBookmarked(true)
        }
    }

    const handleAddToScheduler = () => {
        setSelectWeekModalVisible(true)
    }

    const onDaySelected = async (day: keyof typeof Day | null) => {
        setSelectWeekModalVisible(false)
        if (day && food) {
            const recipe = await AddToMyScheduler(food, day)
            if (recipe) {
                setRefreshScheduler(true)
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: t(TranslationKeys.Scheduler.RECIPE_ADDED_TO_SCHEDULER)
                })
            } else {
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: t(TranslationKeys.Scheduler.RECIPE_ALREADY_ADDED_TO_SCHEDULER) + ' ' + t(TranslationKeys.Day[day]).toLowerCase()
                })
            }

        }
    }

    const handleOpenComments = () => {
        router.push(`/comments/${foodRecipesItemId}`)
    }

    const handleOpenAuthor = () => {
        if (!author) return
        router.push(`/authorRecipes/${author.id}`)
    }

    const renderItem = ({ item }: { item: string }) => {
        return (
            <View style={[styles.images, { width: screenWidth, height: 2 / 3 * screenHeight }]} >
                <Image source={{ uri: item }} style={[styles.image, { width: screenWidth, height: 2 * screenHeight / 3 }]} contentFit="cover" transition={300} />
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0.8)', 'rgba(255, 255, 255, 0)']}
                    start={{ x: 0.5, y: - 0.2 }}
                    end={{ x: 0.5, y: 0.15 }}
                    style={[styles.gradientTop, StyleSheet.absoluteFill]} />
                <LinearGradient
                    colors={['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.8)']}
                    start={{ x: 0.5, y: 0.8 }}
                    end={{ x: 0.5, y: 1.1 }}
                    style={[styles.gradientBottom, StyleSheet.absoluteFill]} />
            </View>
        )
    }

    const options =
        [
            { title: t(TranslationKeys.Recipe.EDIT_RECIPE), code: 'edit' },
            { title: t(TranslationKeys.Recipe.DELETE_RECIPE), code: 'delete' },
        ]

    const handleEditRecipe = () => {
        router.replace({
            pathname: `/(addRecipe)/addRecipe`,
            params: {
                addEditRecipeId: foodRecipesItemId
            }
        })
    }

    const handleOptionsSelect = (code: string) => {
        switch (code) {
            case 'edit': { handleEditRecipe(); break; }
            case 'delete': { confirmDeleteSheetRef.current?.present(handleDeleteRecipe); break; }
        }
    }

    const handleDeleteRecipe = async () => {
        try {
            await DeleteFoodRecipe(foodRecipesItemId)
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: t(TranslationKeys.Recipe.RECIPE_DELETED)
            })
            router.back()
        } catch {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
        }
    }

    if (loading) return <LoadingScreen />

    return (
        <BackgroundSafeAreaView>
            <View style={[styles.scrollViewContent, styles.flex]}>
                <View style={[styles.flex, { flexDirection: 'row' }]}>
                    <Carousel
                        data={food?.images ?? []}
                        renderItem={renderItem}
                        sliderWidth={screenWidth}
                        itemWidth={screenWidth}
                        layout="default"
                    />

                    <View style={styles.bookmarkContainer}>
                        {author &&
                            <Pressable onPress={handleOpenAuthor}>
                                <Image source={{ uri: author.profilePhoto }} style={styles.authorAvatar} contentFit="cover" transition={300} />
                            </Pressable>}
                        {user &&
                            <>
                                <Text style={styles.savedCount}>{savedCount}</Text>
                                <FontAwesome name={bookmarkIconType} color={COLORS.white} size={1.2 * SIZES.tabIcon} onPress={handleAddToBookmarks} />
                                <Ionicons name='calendar-outline' color={COLORS.white} size={1.2 * SIZES.tabIcon} style={{ marginStart: SIZES.base }} onPress={handleAddToScheduler} />
                                {user.id === food?.author &&
                                    <Pressable onPress={() => optionsSheetRef.current?.present()}>
                                        <Ionicons name="options" color={COLORS.white} size={1.2 * SIZES.tabIcon} style={{ marginStart: SIZES.base / 2, }} />
                                    </Pressable>}
                            </>}
                    </View>
                </View>

                <BottomSheet
                    snapPoints={['35', '65', '95']}
                    backgroundStyle={{ backgroundColor: COLORS.dark }}
                    handleIndicatorStyle={{ backgroundColor: COLORS.white }}
                >
                    <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                        <SubtitleText>{t(TranslationKeys.Recipe.NAME)}</SubtitleText>
                        <View style={styles.inputContainer}>
                            <FontAwesome6 name="bread-slice" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder={t(TranslationKeys.Recipe.NAME)}
                                multiline={true}
                                value={food?.title}
                                autoComplete='off'
                                editable={false}
                            />
                        </View>

                        <SubtitleText>{t(TranslationKeys.Recipe.DESCRIPTION)}</SubtitleText>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="description" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                multiline={true}
                                placeholder={t(TranslationKeys.Recipe.DESCRIPTION)}
                                value={food?.description}
                                autoComplete='off'
                                editable={false}
                            />
                        </View>

                        <SubtitleText>{t(TranslationKeys.Recipe.SERVING_SIZE)}</SubtitleText>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="people" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder={t(TranslationKeys.Recipe.SERVING_SIZE)}
                                value={food?.servingSize}
                                editable={false}
                            />
                        </View>

                        <SubtitleText>{t(TranslationKeys.Recipe.TIME_TO_PREPARE)}</SubtitleText>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="people" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder={t(TranslationKeys.Recipe.TIME_TO_PREPARE)}
                                value={timeDisplay()}
                                editable={false}
                            />
                        </View>

                        <SubtitleText>{t(TranslationKeys.Recipe.INGREDIENTS)}</SubtitleText>
                        {food?.ingredients?.map((ingredient, index) => (
                            <View key={index} style={styles.ingredientItem}>
                                <Text style={[styles.textInput, { width: "auto" }]}>   {t(TranslationKeys.IngredientItem[ingredient.name as keyof typeof TranslationKeys.IngredientItem]) || ingredient.name}   -   {ingredient.amount}  {t(TranslationKeys.UnitItem[ingredient.unit as keyof typeof TranslationKeys.UnitItem]).toLowerCase() || ingredient.unit}</Text>
                            </View>
                        ))}

                        <SubtitleText>{t(TranslationKeys.Recipe.INSTRUCTIONS)}</SubtitleText>
                        {food?.steps?.map((step, index) => (
                            <View style={styles.ingredientItem} key={step.number} >
                                <BottomSheetTextInput
                                    style={styles.input}
                                    multiline={true}
                                    value={`${step.number}. ${step.description}`}
                                    editable={false}
                                />
                            </View>
                        ))}
                        <PillButton onPress={handleOpenComments}>{t(TranslationKeys.Review.SHOW_REVIEWS)}</PillButton>
                    </BottomSheetScrollView>
                </BottomSheet>

            </View>
            <SelectWeekModal visible={selectWeekModalVisible} onClose={(day?: string | null) => { onDaySelected((day as keyof typeof Day) ?? null) }} />
            <OptionsBottomSheet ref={optionsSheetRef} options={options} onSelect={handleOptionsSelect} />
            <ConfirmBottomSheet
                ref={confirmDeleteSheetRef}
                title={t(TranslationKeys.Recipe.DELETE_RECIPE)}
                message={t(TranslationKeys.Recipe.DELETE_RECIPE_CONFIRMATION)}
            />
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
        marginBottom: SIZES.extraLarge,
    },
    image: {
        borderTopLeftRadius: SIZES.extraLarge,
        borderTopRightRadius: SIZES.extraLarge,
        marginTop: SIZES.extraLarge,
    },
    gradientTop: {
        borderTopLeftRadius: SIZES.extraLarge,
        borderTopRightRadius: SIZES.extraLarge,
        marginTop: SIZES.small,
    },
    gradientBottom: {
        borderTopLeftRadius: SIZES.extraLarge,
        borderTopRightRadius: SIZES.extraLarge,
        marginBottom: - SIZES.small,
    },
    input: {
        width: '95%',
        minHeight: 60,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.extraLarge,
        paddingVertical: SIZES.base,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        minHeight: 60,
        backgroundColor: COLORS.white,
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
        fontSize: SIZES.extraLarge,
    },
    ingredientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        minHeight: 60,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        padding: SIZES.small,
        paddingStart: SIZES.medium,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    bookmarkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 'auto',
        position: 'absolute',
        top: SIZES.extraLarge,
        right: SIZES.extraLarge,
        paddingTop: SIZES.base,
    },
    authorAvatar: {
        width: 1.2 * SIZES.tabIcon,
        height: 1.2 * SIZES.tabIcon,
        borderRadius: SIZES.small,
        marginEnd: SIZES.base,
    },
    savedCount: {
        color: COLORS.white,
        fontSize: SIZES.large,
        fontWeight: 'bold',
        marginEnd: SIZES.base,
        textAlignVertical: 'center',
    },
})
