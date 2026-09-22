import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { View, Pressable, Text, StyleSheet, Dimensions, Animated, useAnimatedValue } from 'react-native'
import { Image } from 'expo-image'
import { MaterialIcons, FontAwesome6 } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import Carousel from 'react-native-snap-carousel'
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { useTranslation } from 'react-i18next'
import { router, useLocalSearchParams } from 'expo-router'
import { UserContext } from '../app/_layout'
import { AddIngredientsModal } from '../components/IngredientUnitCategory/AddIngredientsModal'
import { BackgroundSafeAreaView } from '../components/Common/BackgroundSafeAreaView'
import { ConfirmBottomSheet, ConfirmBottomSheetRef } from '../components/Common/ConfirmBottomSheet'
import { DeleteIconButton } from '../components/Common/DeleteIconButton'
import { PillButton } from '../components/Common/PillButton'
import { SelectCategoryList } from '../components/IngredientUnitCategory/SelectCategoryList'
import { SubtitleText } from '../components/Common/SubtitleText'
import { TimeInput } from '../components/Recipes/TimeInput'
import { COLORS, SIZES } from '../constants/Colors'
import { TranslationKeys } from '../locales/_translationKeys'
import { Ingredient, Step, FoodRecipes } from '../model/model'
import { UploadFoodRecipesImages } from '../service/ImageService'
import { GetFoodRecipe, EditFoodRecipe, AddFoodRecipe } from '../service/RecipesService'
import { EnsureAnonymousSession, GetCurrentAuthUid } from '../service/AuthService'
import { Timestamp } from 'firebase/firestore/lite'

const PlaceholderImage = require('../assets/images/icon.png')

export default function AddRecipeTab() {
    const { addEditRecipeId } = useLocalSearchParams<{ addEditRecipeId: string }>()
    const { user } = useContext(UserContext)
    const { t } = useTranslation()

    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height
    const [snapPoints, setSnapPoints] = useState(['66', '95'])
    const [loading, setLoading] = useState(true)
    const [isEdit, setIsEdit] = useState(addEditRecipeId !== undefined)

    const [categoryModalVisible, setCategoryModalVisible] = useState(false)
    const [categoryNumber, setCategoryNumber] = useState<number>(0)
    const [categoryFields, setCategoryFields] = useState<string[]>([])

    const [ingredientsModalVisible, setIngredientsModalVisible] = useState(false)
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([])
    const [ingredientEdit, setIngredientEdit] = useState<Ingredient>()

    const [selectedImageArray, setSelectedImageArray] = useState<string[]>([PlaceholderImage])
    const [selectedImageToUpload, setSelectedImageToUpload] = useState<string[]>([])
    const confirmDeleteImageSheetRef = useRef<ConfirmBottomSheetRef>(null)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [servingSize, setServingSize] = useState('')
    const [cookingTime, setCookingTime] = useState({ hours: '', minutes: '' })
    const [cookingTimeAll, setCookingTimeAll] = useState('')
    const [refreshTime, setRefreshTime] = useState(false)
    const [author, setAuthor] = useState('')

    const [stepList, setStepList] = useState<Step[]>([])
    const [step, setStep] = useState('')
    const [stepsPlaceholder, setStepsPlaceholder] = useState('ADD_FIRST_STEP')

    const addPhotoScale = useAnimatedValue(1)

    const handleAddPhotoPressIn = () => {
        Animated.spring(addPhotoScale, { toValue: 0.9, useNativeDriver: true }).start()
    }

    const handleAddPhotoPressOut = () => {
        Animated.spring(addPhotoScale, { toValue: 1, useNativeDriver: true }).start()
    }

    useEffect(() => {
        if (isEdit) {
            fetchData()
        }
    }, [])

    const fetchData = async () => {
        const recipe = await GetFoodRecipe(addEditRecipeId)
        if (!recipe) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Error.LOADING_FAILED)
            })
            router.back()
            return
        }
        setTitle(recipe.title)
        setDescription(recipe.description)
        setServingSize(recipe.servingSize)
        setCookingTime(recipe.cookingTime)
        setCookingTimeAll(`${recipe.cookingTime.hours}${recipe.cookingTime.minutes}`)
        setRefreshTime(true)
        setStepList(recipe.steps)
        setSelectedIngredients(recipe.ingredients)
        setCategoryFields(recipe.categories)
        setCategoryNumber(recipe.categories.length)
        setSelectedImageArray([...recipe.images, PlaceholderImage])
        setSnapPoints(['35', '65', '95'])
        setStepsPlaceholder('ADD_NEXT_STEP')
    }

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            quality: 0.4,
        })

        if (!result.canceled) {
            setSelectedImageArray([...selectedImageArray.slice(0, -1), result.assets[0].uri, PlaceholderImage])
            setSelectedImageToUpload([...selectedImageToUpload, result.assets[0].uri])
            setSnapPoints(['35', '65', '95'])
        }
    }

    const handleCreateOrEditRecipe = async () => {
        if (!title || !servingSize || !(/\d/.test(cookingTimeAll) && Number(cookingTimeAll) !== 0) || stepList.length === 0 || selectedIngredients.length === 0 || (selectedImageToUpload.length === 0 && selectedImageArray.length === 1)) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: t(TranslationKeys.Recipe.FILL_ALL_FIELDS)
            })
            return
        }
        const updatedStepList = step !== '' ? [...stepList, { number: stepList.length + 1, description: step }] : stepList
        try {
            await EnsureAnonymousSession()
            const newRecipe: FoodRecipes = {
                id: '',
                title: title,
                description: description,
                author: user ? user.id : (GetCurrentAuthUid() ?? ''),
                cookingTime: cookingTime,
                servingSize: servingSize,
                ingredients: selectedIngredients,
                steps: updatedStepList,
                images: [],
                categories: categoryFields,
                searchFields: categoryFields,
                savedCount: 0,
                rating: { sum: 0, count: 0 },
                randomValue: Math.random(),
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            }

            if (isEdit) {
                newRecipe.images = [...selectedImageArray.slice(0, -1)]
                if (selectedImageToUpload.length !== 0) {
                    const uploadedImages = await UploadFoodRecipesImages(selectedImageToUpload)
                    newRecipe.images.concat(uploadedImages)
                }
                await EditFoodRecipe(addEditRecipeId, newRecipe)
                router.replace(`/foodRecipesItem/${addEditRecipeId}`)
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: t(TranslationKeys.Recipe.RECIPE_EDITED)
                })
            } else {
                const uploadedImages = await UploadFoodRecipesImages(selectedImageToUpload)
                newRecipe.images = uploadedImages
                const createdRecipeId = await AddFoodRecipe(newRecipe)
                router.replace(`/foodRecipesItem/${createdRecipeId}`)
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: t(TranslationKeys.Recipe.RECIPE_CREATED)
                })
            }
        } catch (error) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(TranslationKeys.Recipe.RECIPE_NOT_CREATED)
            })
        }
    }

    const handleDeleteImage = (image: string) => {
        confirmDeleteImageSheetRef.current?.present(() => {
            const updatedItems = selectedImageToUpload.filter((item) => item !== image)
            setSelectedImageArray([...updatedItems, PlaceholderImage])
            setSelectedImageToUpload([...updatedItems])
            if (updatedItems.length === 0) {
                setSnapPoints(['66', '95'])
            }
        })
    }

    const handleDeleteIngredient = (newIngredient: Ingredient) => {
        const updatedIngredients = selectedIngredients.filter((ingredient) => ingredient.name !== newIngredient.name)
        setSelectedIngredients(updatedIngredients)
    }

    const handleDeleteStep = (index: number) => {
        setStepList((prevStepList) => {
            const updatedStepList = prevStepList.filter((_, stepIndex) => stepIndex !== index)
            if (updatedStepList.length === 0) setStepsPlaceholder('ADD_FIRST_STEP')
            return updatedStepList.map((step, idx) => ({
                ...step,
                number: idx + 1
            }))
        })
    }

    const handleAddIngredient = (newIngredient: Ingredient) => {
        const updatedIngredients = selectedIngredients.map(ingredient =>
            ingredient.name === newIngredient.name ? newIngredient : ingredient
        )
        if (!updatedIngredients.some(ingredient => ingredient.name === newIngredient.name)) {
            updatedIngredients.push(newIngredient)
        }
        setSelectedIngredients(updatedIngredients)
    }

    const handleOpenCategoryModal = () => {
        setCategoryModalVisible(true)
    }

    const handleCloseCategoryModal = (selectedCategories: string[]) => {
        setCategoryNumber(selectedCategories.length)
        setCategoryModalVisible(false)
        setCategoryFields(selectedCategories)
    }

    const handlePressToEdit = (ingredient: Ingredient) => {
        setIngredientEdit(ingredient)
        setIngredientsModalVisible(true)
    }

    const handleCloseIngredientModal = () => {
        setIngredientsModalVisible(false)
        setIngredientEdit(undefined)
    }

    const handleNextStep = (text: string) => {
        if (text === '') return
        let numberOfSteps = stepList.length
        setStepList([...stepList, { number: ++numberOfSteps, description: text }])
        setStep('')
        setStepsPlaceholder('ADD_NEXT_STEP')
    }

    const handleChangeText = (text: string, index: number) => {
        setStepList(prevStepList => {
            const updatedStepList = [...prevStepList]
            const updatedString = text.split('. ')[1] || ''
            updatedStepList[index] = { ...updatedStepList[index], description: updatedString }
            return updatedStepList
        })
    }

    const handleTimeChange = (newTime: { hours: string, minutes: string, all: string }) => {
        setCookingTime({ hours: newTime.hours, minutes: newTime.minutes })
        setCookingTimeAll(newTime.all)
    }

    const renderItem = ({ item }: { item: string }) => {
        return (
            <View>
                {
                    item === PlaceholderImage ? (
                        <Animated.View style={[styles.images, { width: screenWidth, height: screenHeight / 3, transform: [{ scale: addPhotoScale }] }]}>
                            <Pressable style={styles.addPhotoPressable} onPress={pickImageAsync} onPressIn={handleAddPhotoPressIn} onPressOut={handleAddPhotoPressOut}>
                                <MaterialIcons name="add-photo-alternate" size={128} color={COLORS.lightDark} />
                            </Pressable>
                        </Animated.View>
                    ) : (
                        <Pressable style={[styles.images, { width: screenWidth, height: 2 * screenHeight / 3 }]} onLongPress={() => handleDeleteImage(item)}>
                            <Image source={{ uri: item }} style={[styles.image, { width: screenWidth, height: 2 * screenHeight / 3 }]} contentFit="cover" transition={300} />
                        </Pressable>
                    )
                }
            </View>
        )
    }

    return (
        <BackgroundSafeAreaView>
            <View style={[styles.scrollViewContent, styles.flex]}>
                <View style={[styles.flex, { flexDirection: 'row' }]}>
                    <Carousel
                        data={selectedImageArray}
                        renderItem={renderItem}
                        sliderWidth={screenWidth}
                        itemWidth={screenWidth}
                        layout="default"
                    />
                </View>

                <BottomSheet
                    snapPoints={useMemo(() => snapPoints, [snapPoints])}
                    backgroundStyle={{ backgroundColor: COLORS.dark }}
                    handleIndicatorStyle={{ backgroundColor: COLORS.white }}
                    keyboardBehavior='extend'
                >
                    <BottomSheetScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollViewContent}
                        keyboardShouldPersistTaps={'handled'}>

                        <SubtitleText>{t(TranslationKeys.Recipe.NAME)}</SubtitleText>
                        <View style={styles.inputContainer}>
                            <FontAwesome6 name="bread-slice" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder={t(TranslationKeys.Recipe.NAME)}
                                multiline={true}
                                value={title}
                                autoComplete='off'
                                maxLength={60}
                                onChangeText={text => setTitle(text)}
                            />
                        </View>

                        <SubtitleText>{t(TranslationKeys.Recipe.DESCRIPTION)}</SubtitleText>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="description" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder={t(TranslationKeys.Recipe.DESCRIPTION)}
                                multiline={true}
                                value={description}
                                autoComplete='off'
                                maxLength={1000}
                                onChangeText={text => setDescription(text)}
                            />
                        </View>

                        <SubtitleText>{t(TranslationKeys.Recipe.SERVING_SIZE)}</SubtitleText>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="people" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder={t(TranslationKeys.Recipe.SERVING_SIZE)}
                                value={servingSize}
                                onChangeText={text => setServingSize(text)}
                                autoComplete='off'
                                maxLength={3}
                                keyboardType='numeric'
                            />
                        </View>

                        <SubtitleText>{t(TranslationKeys.Recipe.TIME_TO_PREPARE)}</SubtitleText>
                        <TimeInput time={cookingTime} onTimeChange={handleTimeChange} refresh={refreshTime} />

                        <SubtitleText>{t(TranslationKeys.Recipe.SELECTED_CATEGORIES)}: {categoryNumber}</SubtitleText>
                        <PillButton onPress={() => handleOpenCategoryModal()}>{t(TranslationKeys.Recipe.ADD_CATEGORIES)}</PillButton>

                        <SubtitleText>{t(TranslationKeys.Recipe.INGREDIENTS)}</SubtitleText>
                        {selectedIngredients?.map((ingredient, index) => (
                            <Pressable key={index} style={styles.ingredientItem} onPress={() => handlePressToEdit(ingredient)}>
                                <Text style={[styles.textInput, { width: "85%" }]}>   {t(TranslationKeys.IngredientItem[ingredient.name as keyof typeof TranslationKeys.IngredientItem]) || ingredient.name}   -   {ingredient.amount}  {t(TranslationKeys.UnitItem[ingredient.unit as keyof typeof TranslationKeys.UnitItem]).toLowerCase() || ingredient.unit}</Text>
                                <DeleteIconButton style={styles.icon} onPress={() => handleDeleteIngredient(ingredient)} />
                            </Pressable>
                        ))}
                        <PillButton onPress={() => setIngredientsModalVisible(true)}>{t(TranslationKeys.Recipe.ADD_INGREDIENT)}</PillButton>

                        <SubtitleText>{t(TranslationKeys.Recipe.INSTRUCTIONS)}</SubtitleText>
                        {stepList?.map((step, index) => (
                            <Pressable key={index} style={styles.ingredientItem} >
                                <BottomSheetTextInput
                                    style={[styles.input, { width: "85%" }]}
                                    multiline={true}
                                    value={`${step.number}. ${step.description}`}
                                    autoComplete='off'
                                    onChangeText={(text) => handleChangeText(text, index)}
                                    key={step.number}
                                />
                                <DeleteIconButton style={styles.icon} onPress={() => handleDeleteStep(index)} />
                            </Pressable>
                        ))}
                        <View style={styles.ingredientItem} >
                            <BottomSheetTextInput
                                style={styles.input}
                                placeholder={t(TranslationKeys.Recipe[stepsPlaceholder as keyof typeof TranslationKeys.Recipe]) || stepsPlaceholder}
                                value={step}
                                autoComplete='off'
                                onChangeText={(text) => setStep(text)}
                                onEndEditing={() => handleNextStep(step)}
                                onSubmitEditing={() => handleNextStep(step)}
                                blurOnSubmit={false}
                            />
                        </View>
                        <PillButton onPress={handleCreateOrEditRecipe}>{isEdit ? t(TranslationKeys.Recipe.EDIT_RECIPE) : t(TranslationKeys.Recipe.CREATE_RECIPE)}</PillButton>
                    </BottomSheetScrollView>
                </BottomSheet>

                <AddIngredientsModal
                    visible={ingredientsModalVisible}
                    dataEdit={ingredientEdit}
                    onAdd={handleAddIngredient}
                    onClose={handleCloseIngredientModal} />

                <SelectCategoryList
                    alreadySelected={categoryFields}
                    visible={categoryModalVisible}
                    onClose={(selectedCategories: string[]) => handleCloseCategoryModal(selectedCategories)} />

                <ConfirmBottomSheet
                    ref={confirmDeleteImageSheetRef}
                    title={t(TranslationKeys.Recipe.DELETE_IMAGE)}
                    message={t(TranslationKeys.Recipe.DELETE_IMAGE_CONFIRMATION)}
                />
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
        marginBottom: SIZES.extraLarge,
    },
    addPhotoPressable: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        borderTopLeftRadius: SIZES.extraLarge,
        borderTopRightRadius: SIZES.extraLarge,
        marginTop: SIZES.extraLarge,
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
        width: '86%',
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
})
