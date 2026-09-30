import { useContext, useEffect, useRef, useState } from 'react'
import { View, Pressable, Text, StyleSheet, Dimensions, Animated, useAnimatedValue, ActivityIndicator, Keyboard } from 'react-native'
import { Image } from 'expo-image'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as ImagePicker from 'expo-image-picker'
import { Carousel } from 'react-native-reanimated-carousel'
import { useSharedValue } from 'react-native-reanimated'
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ALERT_TYPE, Toast } from 'react-native-alert-notification'
import { useTranslation } from 'react-i18next'
import { router, useLocalSearchParams } from 'expo-router'
import { UserContext } from '../app/_layout'
import { AddIngredientsModal } from '../components/RecipeControls/AddIngredientsModal'
import { SelectIngredientOrUnitList } from '../components/RecipeControls/SelectIngredientOrUnitList'
import { AddSectionModal } from '../components/RecipeControls/AddSectionModal'
import { BackgroundSafeAreaView } from '../components/Common/BackgroundSafeAreaView'
import { CarouselPagination } from '../components/Common/CarouselPagination'
import { GroupHeaderChip } from '../components/Common/GroupHeaderChip'
import { ConfirmBottomSheet, ConfirmBottomSheetRef } from '../components/Common/ConfirmBottomSheet'
import { DeleteIconButton } from '../components/Common/DeleteIconButton'
import { ImagePreviewModal } from '../components/Common/ImagePreviewModal'
import { PillButton } from '../components/Common/PillButton'
import { SelectCategoryList } from '../components/RecipeControls/SelectCategoryList'
import { SubtitleText } from '../components/Common/SubtitleText'
import { TimeInput } from '../components/RecipeControls/TimeInput'
import { ALERT_COLORS, COLORS, SIZES } from '../constants/Colors'
import { TranslationKeys } from '../locales/_translationKeys'
import { Ingredient, Step, FoodRecipes } from '../model/model'
import { CheckImageContentResult, ValidateRecipeImage } from '../service/ImageClassificationService'
import { UploadFoodRecipesImages } from '../service/ImageService'
import { GetFoodRecipe, EditFoodRecipe, AddFoodRecipe } from '../service/RecipesService'
import { GetIngredientSections, GroupIngredientsBySections } from '../service/IngredientService'
import { EnsureAnonymousSession, GetCurrentAuthUid } from '../service/AuthService'
import { Timestamp } from 'firebase/firestore/lite'

const PlaceholderImage = require('../assets/images/icon.png')
const hasImagesSnapPoints = ['33', '95']
const noImagesSnapPoints = ['66', '95']

export default function AddRecipeTab() {
    const { addEditRecipeId } = useLocalSearchParams<{ addEditRecipeId: string }>()
    const { user } = useContext(UserContext)
    const { t } = useTranslation()

    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height
    const [snapPoints, setSnapPoints] = useState(noImagesSnapPoints)
    const [isEdit] = useState(addEditRecipeId !== undefined)
    const [submitting, setSubmitting] = useState(false)
    const [classifyingImages, setClassifyingImages] = useState(false)
    const [missingFieldKeys, setMissingFieldKeys] = useState<string[]>([])

    const [categoryModalVisible, setCategoryModalVisible] = useState(false)
    const [categoryNumber, setCategoryNumber] = useState<number>(0)
    const [categoryFields, setCategoryFields] = useState<string[]>([])

    const [ingredientsModalVisible, setIngredientsModalVisible] = useState(false)
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([])
    const [ingredientEdit, setIngredientEdit] = useState<Ingredient>()
    const [ingredientNamePickerVisible, setIngredientNamePickerVisible] = useState(false)
    const [presetIngredientName, setPresetIngredientName] = useState<string>()
    const [sections, setSections] = useState<string[]>([])
    const [sectionModalVisible, setSectionModalVisible] = useState(false)
    const [sectionEdit, setSectionEdit] = useState<string>()

    const [selectedImageArray, setSelectedImageArray] = useState<string[]>([PlaceholderImage])
    const [selectedImageToUpload, setSelectedImageToUpload] = useState<string[]>([])
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewIndex, setPreviewIndex] = useState(0)
    const carouselProgress = useSharedValue(0)
    const insets = useSafeAreaInsets()
    const confirmDeleteImageSheetRef = useRef<ConfirmBottomSheetRef>(null)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [servingSize, setServingSize] = useState('')
    const [cookingTime, setCookingTime] = useState({ hours: '', minutes: '' })
    const [cookingTimeAll, setCookingTimeAll] = useState('')
    const [refreshTime, setRefreshTime] = useState(false)

    const [stepList, setStepList] = useState<Step[]>([])
    const [step, setStep] = useState('')
    const [stepsPlaceholder, setStepsPlaceholder] = useState('ADD_FIRST_STEP')
    const stepRef = useRef('')

    const addPhotoScale = useAnimatedValue(1)

    const handleAddPhotoPressIn = () => {
        Animated.spring(addPhotoScale, { toValue: 0.9, useNativeDriver: true }).start()
    }

    const handleAddPhotoPressOut = () => {
        Animated.spring(addPhotoScale, { toValue: 1, useNativeDriver: true }).start()
    }

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
        setDescription(recipe.description ?? '')
        setServingSize(recipe.servingSize ?? '')
        setCookingTime(recipe.cookingTime ?? { hours: '', minutes: '' })
        setCookingTimeAll(`${recipe.cookingTime?.hours ?? ''}${recipe.cookingTime?.minutes ?? ''}`)
        setRefreshTime(true)
        setStepList(recipe.steps ?? [])
        setSelectedIngredients(recipe.ingredients ?? [])
        setSections(GetIngredientSections(recipe.ingredients ?? []))
        setCategoryFields(recipe.categories ?? [])
        setCategoryNumber(recipe.categories?.length ?? 0)
        setSelectedImageArray([...(recipe.images ?? []), PlaceholderImage])
        setSnapPoints(hasImagesSnapPoints)
        setStepsPlaceholder('ADD_NEXT_STEP')
    }

    useEffect(() => {
        if (isEdit) {
            fetchData()
        }
    }, [])

    const pickImageAsync = async () => {
        if (classifyingImages) return
        Keyboard.dismiss()
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            quality: 0.4,
            allowsMultipleSelection: true,
        })

        if (!result.canceled) {
            setClassifyingImages(true)
            try {
                const pickedUris = result.assets.map((asset) => asset.uri)
                const validations: CheckImageContentResult[] = await Promise.all(pickedUris.map((uri) =>
                    ValidateRecipeImage(uri).catch(() => ({ approved: true }))
                ))
                const newUris = pickedUris.filter((_, index) => validations[index].approved)
                const hasUnsafe = validations.some((validation) => validation.reason === 'unsafe')
                const hasNotFood = validations.some((validation) => validation.reason === 'not_food')

                if (hasNotFood) {
                    requestIdleCallback(() => Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: t(TranslationKeys.Recipe.IMAGE_NOT_FOOD)
                    }))
                } else if (hasUnsafe) {
                    requestIdleCallback(() => Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: t(TranslationKeys.Recipe.IMAGE_UNSAFE)
                    }))
                }

                if (newUris.length > 0) {
                    setSelectedImageArray([...selectedImageArray.slice(0, -1), ...newUris, PlaceholderImage])
                    setSelectedImageToUpload([...selectedImageToUpload, ...newUris])
                    setSnapPoints(hasImagesSnapPoints)
                }
            } finally {
                setClassifyingImages(false)
            }
        }
    }

    const handleCreateOrEditRecipe = async () => {
        if (submitting) return
        const missingFields = [
            !title && { key: 'name', label: t(TranslationKeys.Recipe.NAME) },
            !servingSize && { key: 'servingSize', label: t(TranslationKeys.Recipe.SERVING_SIZE) },
            !(/\d/.test(cookingTimeAll) && Number(cookingTimeAll) !== 0) && { key: 'time', label: t(TranslationKeys.Recipe.TIME_TO_PREPARE) },
            selectedIngredients.length === 0 && { key: 'ingredients', label: t(TranslationKeys.Recipe.INGREDIENTS) },
            stepList.length === 0 && { key: 'steps', label: t(TranslationKeys.Recipe.INSTRUCTIONS) },
        ].filter((field): field is { key: string, label: string } => Boolean(field))

        if (missingFields.length > 0) {
            setMissingFieldKeys(missingFields.map(field => field.key))
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: t(TranslationKeys.Recipe.FILL_ALL_FIELDS),
                textBody: missingFields.map(field => field.label).join(', ')
            })
            return
        }
        setMissingFieldKeys([])
        const updatedStepList = step !== '' ? [...stepList, { number: stepList.length + 1, description: step }] : stepList
        setSubmitting(true)
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
                rating: { sum: 0, count: 0, weighted: 0 },
                randomValue: Math.random(),
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            }

            if (isEdit) {
                const existingImages = selectedImageArray.slice(0, -1).filter((uri) => !selectedImageToUpload.includes(uri))
                const uploadedImages = selectedImageToUpload.length !== 0
                    ? await UploadFoodRecipesImages(selectedImageToUpload)
                    : []
                newRecipe.images = [...existingImages, ...uploadedImages]
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
        } catch {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: t(isEdit ? TranslationKeys.Recipe.RECIPE_NOT_EDITED : TranslationKeys.Recipe.RECIPE_NOT_CREATED)
            })
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteImage = (image: string) => {
        confirmDeleteImageSheetRef.current?.present(() => {
            const updatedImageArray = selectedImageArray.filter((item) => item !== image)
            const updatedImageToUpload = selectedImageToUpload.filter((item) => item !== image)
            setSelectedImageArray(updatedImageArray)
            setSelectedImageToUpload(updatedImageToUpload)
            if (updatedImageArray.length === 1) {
                setSnapPoints(noImagesSnapPoints)
            }
        })
    }

    const handleDeleteIngredient = (ingredientToDelete: Ingredient) => {
        setSelectedIngredients(selectedIngredients.filter((ingredient) => ingredient !== ingredientToDelete))
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
        if (ingredientEdit) {
            setSelectedIngredients(selectedIngredients.map(ingredient => ingredient === ingredientEdit ? newIngredient : ingredient))
        } else {
            setSelectedIngredients([...selectedIngredients, newIngredient])
        }
    }

    const handleSaveSection = (sectionName: string) => {
        if (sectionEdit) {
            if (sectionName !== sectionEdit && sections.includes(sectionName)) return
            setSections(sections.map((section) => section === sectionEdit ? sectionName : section))
            setSelectedIngredients(selectedIngredients.map((ingredient) => ingredient.group === sectionEdit ? { ...ingredient, group: sectionName } : ingredient))
        } else {
            if (sections.includes(sectionName)) return
            setSections([...sections, sectionName])
        }
    }

    const handlePressToEditSection = (section: string) => {
        setSectionEdit(section)
        setSectionModalVisible(true)
    }

    const handleCloseSectionModal = () => {
        setSectionModalVisible(false)
        setSectionEdit(undefined)
    }

    const handleDeleteSection = (section: string) => {
        setSections(sections.filter((existingSection) => existingSection !== section))
        setSelectedIngredients(selectedIngredients.map((ingredient) =>
            ingredient.group === section ? { name: ingredient.name, unit: ingredient.unit, ...(ingredient.amount !== undefined && { amount: ingredient.amount }) } : ingredient
        ))
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
        setPresetIngredientName(undefined)
    }

    const handleOpenAddIngredient = () => {
        setIngredientNamePickerVisible(true)
    }

    const handleIngredientNameSelected = (name: string) => {
        setIngredientNamePickerVisible(false)
        setPresetIngredientName(name)
        setIngredientsModalVisible(true)
    }

    const handleNextStep = () => {
        const text = stepRef.current
        if (text === '') return
        setStepList(prevStepList => [...prevStepList, { number: prevStepList.length + 1, description: text }])
        setStep('')
        stepRef.current = ''
        setStepsPlaceholder('ADD_NEXT_STEP')
    }

    useEffect(() => {
        const subscription = Keyboard.addListener('keyboardDidHide', handleNextStep)
        return () => subscription.remove()
    }, [])

    const handleChangeText = (text: string, index: number) => {
        setStepList(prevStepList => {
            const updatedStepList = [...prevStepList]
            const updatedString = text.replace(/^\d+\.\s*/, '')
            updatedStepList[index] = { ...updatedStepList[index], description: updatedString }
            return updatedStepList
        })
    }

    const handleTimeChange = (newTime: { hours: string, minutes: string, all: string }) => {
        setCookingTime({ hours: newTime.hours, minutes: newTime.minutes })
        setCookingTimeAll(newTime.all)
    }

    const renderItem = ({ item, index }: { item: string, index: number }) => {
        return (
            <View>
                {
                    item === PlaceholderImage ? (
                        <Animated.View style={[styles.images, { width: screenWidth, height: screenHeight / 3, transform: [{ scale: addPhotoScale }] }]}>
                            <Pressable style={styles.addPhotoPressable} onPress={pickImageAsync} onPressIn={handleAddPhotoPressIn} onPressOut={handleAddPhotoPressOut}>
                                {classifyingImages ? (
                                    <ActivityIndicator size="large" color={COLORS.primary} />
                                ) : (
                                    <MaterialIcons name="add-photo-alternate" size={128} color={COLORS.lightDark} />
                                )}
                            </Pressable>
                        </Animated.View>
                    ) : (
                        <Pressable style={[styles.images, { width: screenWidth, height: 2 * screenHeight / 3 }]} onPress={() => { setPreviewIndex(index); setPreviewVisible(true) }}>
                            <Image source={{ uri: item }} style={[styles.image, { width: screenWidth, height: 2 * screenHeight / 3 }]} contentFit="cover" transition={300} />
                            <LinearGradient
                                colors={['rgba(0, 0, 0, 0.8)', 'rgba(255, 255, 255, 0)']}
                                start={{ x: 0.5, y: -0.2 }}
                                end={{ x: 0.5, y: 0.15 }}
                                style={[styles.gradientTop, StyleSheet.absoluteFill]} />
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.8)']}
                                start={{ x: 0.5, y: 0.8 }}
                                end={{ x: 0.5, y: 1.1 }}
                                style={[styles.gradientBottom, StyleSheet.absoluteFill]} />
                            <View style={styles.deleteImageButton}>
                                <DeleteIconButton style={styles.deleteImageIcon} onPress={() => handleDeleteImage(item)} />
                            </View>
                        </Pressable>
                    )
                }
            </View>
        )
    }

    const { ungrouped: ungroupedIngredients, grouped: groupedIngredients } = GroupIngredientsBySections(selectedIngredients, sections)

    return (
        <BackgroundSafeAreaView>
            <View style={[styles.scrollViewContent, styles.flex]}>
                <View style={[styles.flex, { flexDirection: 'row' }]}>
                    <Carousel
                        data={selectedImageArray}
                        renderItem={renderItem}
                        style={{ width: screenWidth, flex: 1 }}
                        layout={{ type: 'parallax', offset: 0, scale: 1, adjacentScale: 0.9 }}
                        progress={carouselProgress}
                    />
                    {selectedImageArray.length > 2 &&
                        <CarouselPagination
                            count={selectedImageArray.length}
                            progress={carouselProgress}
                            top={0.66 * screenHeight - SIZES.extraLarge - SIZES.small - insets.bottom}
                        />}
                </View>

                <BottomSheet
                    snapPoints={snapPoints}
                    backgroundStyle={{ backgroundColor: COLORS.dark }}
                    handleIndicatorStyle={{ backgroundColor: COLORS.white }}
                    keyboardBehavior='extend'
                >
                    <BottomSheetScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollViewContent}
                        keyboardShouldPersistTaps={'handled'}>

                        <SubtitleText style={missingFieldKeys.includes('name') ? styles.errorLabel : undefined}>{t(TranslationKeys.Recipe.NAME)}*</SubtitleText>
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="food-fork-drink" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder={t(TranslationKeys.Recipe.NAME)}
                                placeholderTextColor={COLORS.lightDark}
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
                                placeholderTextColor={COLORS.lightDark}
                                multiline={true}
                                value={description}
                                autoComplete='off'
                                maxLength={1000}
                                onChangeText={text => setDescription(text)}
                            />
                        </View>

                        <SubtitleText style={missingFieldKeys.includes('servingSize') ? styles.errorLabel : undefined}>{t(TranslationKeys.Recipe.SERVING_SIZE)}*</SubtitleText>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="people" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder={t(TranslationKeys.Recipe.SERVING_SIZE)}
                                placeholderTextColor={COLORS.lightDark}
                                value={servingSize}
                                onChangeText={text => setServingSize(text.replace(/[^0-9]/g, ''))}
                                autoComplete='off'
                                maxLength={3}
                                keyboardType='numeric'
                            />
                        </View>

                        <SubtitleText style={missingFieldKeys.includes('time') ? styles.errorLabel : undefined}>{t(TranslationKeys.Recipe.TIME_TO_PREPARE)}*</SubtitleText>
                        <TimeInput time={cookingTime} onTimeChange={handleTimeChange} refresh={refreshTime} />

                        <SubtitleText>{t(TranslationKeys.Recipe.SELECTED_CATEGORIES)}: {categoryNumber}</SubtitleText>
                        <PillButton onPress={() => handleOpenCategoryModal()}>{t(TranslationKeys.Recipe.ADD_CATEGORIES)}</PillButton>

                        <SubtitleText>{t(TranslationKeys.Recipe.SECTIONS)}</SubtitleText>
                        {sections.map((section) => (
                            <Pressable key={section} style={styles.ingredientItem} onPress={() => handlePressToEditSection(section)}>
                                <Text style={[styles.textInput, { width: "85%" }]}>   {section}</Text>
                                <DeleteIconButton style={styles.icon} onPress={() => handleDeleteSection(section)} />
                            </Pressable>
                        ))}
                        <PillButton onPress={() => setSectionModalVisible(true)}>{t(TranslationKeys.Recipe.ADD_SECTION)}</PillButton>

                        <SubtitleText style={missingFieldKeys.includes('ingredients') ? styles.errorLabel : undefined}>{t(TranslationKeys.Recipe.INGREDIENTS)}*</SubtitleText>
                        {ungroupedIngredients.map((ingredient, index) => (
                            <Pressable key={index} style={styles.ingredientItem} onPress={() => handlePressToEdit(ingredient)}>
                                <Text style={[styles.textInput, { width: "85%" }]}>   {t(TranslationKeys.IngredientItem[ingredient.name as keyof typeof TranslationKeys.IngredientItem]) || ingredient.name}   -   {ingredient.amount}  {t(TranslationKeys.UnitItem[ingredient.unit as keyof typeof TranslationKeys.UnitItem]).toLowerCase() || ingredient.unit}</Text>
                                <DeleteIconButton style={styles.icon} onPress={() => handleDeleteIngredient(ingredient)} />
                            </Pressable>
                        ))}
                        {groupedIngredients.map(({ section, ingredients }) => (
                            <View key={section} style={styles.ingredientGroup}>
                                <GroupHeaderChip label={section} />
                                {ingredients.map((ingredient, index) => (
                                    <Pressable key={index} style={styles.ingredientItem} onPress={() => handlePressToEdit(ingredient)}>
                                        <Text style={[styles.textInput, { width: "85%" }]}>   {t(TranslationKeys.IngredientItem[ingredient.name as keyof typeof TranslationKeys.IngredientItem]) || ingredient.name}   -   {ingredient.amount}  {t(TranslationKeys.UnitItem[ingredient.unit as keyof typeof TranslationKeys.UnitItem]).toLowerCase() || ingredient.unit}</Text>
                                        <DeleteIconButton style={styles.icon} onPress={() => handleDeleteIngredient(ingredient)} />
                                    </Pressable>
                                ))}
                            </View>
                        ))}
                        <PillButton onPress={handleOpenAddIngredient}>{t(TranslationKeys.Recipe.ADD_INGREDIENT)}</PillButton>

                        <SubtitleText style={missingFieldKeys.includes('steps') ? styles.errorLabel : undefined}>{t(TranslationKeys.Recipe.INSTRUCTIONS)}*</SubtitleText>
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
                                placeholderTextColor={COLORS.lightDark}
                                value={step}
                                autoComplete='off'
                                onChangeText={(text) => { setStep(text); stepRef.current = text }}
                                onSubmitEditing={handleNextStep}
                                submitBehavior="submit"
                            />
                        </View>
                        <PillButton onPress={handleCreateOrEditRecipe} loading={submitting}>{isEdit ? t(TranslationKeys.Recipe.EDIT_RECIPE) : t(TranslationKeys.Recipe.CREATE_RECIPE)}</PillButton>
                    </BottomSheetScrollView>
                </BottomSheet>

                <AddIngredientsModal
                    visible={ingredientsModalVisible}
                    dataEdit={ingredientEdit}
                    presetName={presetIngredientName}
                    groups={sections}
                    onAdd={handleAddIngredient}
                    onClose={handleCloseIngredientModal} />

                <SelectIngredientOrUnitList
                    modalDataType="ingredient"
                    visible={ingredientNamePickerVisible}
                    onAdd={(item) => handleIngredientNameSelected(item.name)}
                    onClose={() => setIngredientNamePickerVisible(false)} />

                <AddSectionModal
                    key={sectionEdit ?? 'new-section'}
                    visible={sectionModalVisible}
                    dataEdit={sectionEdit}
                    onSave={handleSaveSection}
                    onClose={handleCloseSectionModal} />

                <SelectCategoryList
                    alreadySelected={categoryFields}
                    visible={categoryModalVisible}
                    onClose={(selectedCategories: string[]) => handleCloseCategoryModal(selectedCategories)} />

                <ConfirmBottomSheet
                    ref={confirmDeleteImageSheetRef}
                    title={t(TranslationKeys.Recipe.DELETE_IMAGE)}
                    message={t(TranslationKeys.Recipe.DELETE_IMAGE_CONFIRMATION)}
                />

                <ImagePreviewModal
                    visible={previewVisible}
                    images={selectedImageArray.filter((uri) => uri !== PlaceholderImage)}
                    initialIndex={previewIndex}
                    onClose={() => setPreviewVisible(false)}
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
    gradientBottom: {
        borderTopLeftRadius: SIZES.extraLarge,
        borderTopRightRadius: SIZES.extraLarge,
        marginBottom: - SIZES.small,
    },
    gradientTop: {
        borderTopLeftRadius: SIZES.extraLarge,
        borderTopRightRadius: SIZES.extraLarge,
        marginTop: SIZES.small,
    },
    deleteImageButton: {
        position: 'absolute',
        top: SIZES.extraLarge,
        right: SIZES.extraLarge,
        paddingTop: SIZES.base,
    },
    deleteImageIcon: {
        color: COLORS.white,
        fontSize: 1.2 * SIZES.tabIcon,
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
        fontSize: SIZES.tabIcon,
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
    ingredientGroup: {
        width: '100%',
        alignItems: 'center',
    },
    errorLabel: {
        color: ALERT_COLORS.danger,
    },
})
