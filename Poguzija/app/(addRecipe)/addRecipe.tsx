import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView'
import {  useContext, useEffect, useMemo, useRef, useState } from 'react'
import { View, TextInput, Pressable, Text, StyleSheet, Image, Platform, ScrollView, KeyboardAvoidingView, Alert, Dimensions, Modal, FlatList, Button } from 'react-native'
import { FoodRecipes, Ingredient, Step, StorageFolder } from '../../model/model'
const PlaceholderImage = require('../../assets/images/icon.png')
import { MaterialIcons, Entypo } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import Carousel from 'react-native-snap-carousel'
import { COLORS, SIZES } from '../../constants/Colors'
import AddIngredientsModal from '../../components/AddIngredientsModal'
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { getCurrentUser } from '../../service/UserService'
import { AddFoodRecipe, UploadFoodRecipesImages } from '../../service/RecipesService'
import { UserContext } from '../_layout'


export default function AddRecipeScreen() {
    const { user } = useContext(UserContext)

    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height
    const [snapPoints, setSnapPoints] = useState(['66', '95'])

    const [ingredientsModalVisible, setIngredientsModalVisible] = useState(false)
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([])
    const [ingredientEdit, setIngredientEdit] = useState<Ingredient>()

    const [selectedImageArray, setSelectedImageArray] = useState<string[]>([PlaceholderImage])
    const [selectedImageToUpload, setSelectedImageToUpload] = useState<string[]>([])

    const [title, setTitle] = useState('')
    const [servingSize, setServingSize] = useState('')
    const [cookingTime, setCookingTime] = useState('')
    const [author, setAuthor] = useState('')

    const [stepList, setStepList] = useState<Step[]>([])
    const [step, setStep] = useState('')
    const [stepsPlaceholder, setStepsPlaceholder] = useState('Add first step')

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

    const handleCreateRecipe = async () => {
        const updatedStepList = step !== '' ? [...stepList, { number: stepList.length + 1, description: step }] : stepList
        try {
            const newRecipe: Partial<FoodRecipes> = {
                title: title,
                author: user ? user.id : '',
                servingSize: servingSize,
                ingredients: selectedIngredients,
                steps: updatedStepList,
            }

            const uploadedImages = await UploadFoodRecipesImages(selectedImageToUpload, StorageFolder.FoodRecipesPhotos)
            newRecipe.images = uploadedImages

            setTitle('')
            setAuthor('')
            setStepList([])
            setServingSize('')
            setCookingTime('')
            setSelectedIngredients([])
            setSelectedImageArray([PlaceholderImage])
            setSelectedImageToUpload([])
            setSnapPoints(['66', '95'])

            AddFoodRecipe(newRecipe)
            alert('Recipe created successfully')
        } catch (error) {
            alert(`Error creating recipe:' ${error}`)
        }
    }

    const handleDeleteImage = (image: string) => {
        Alert.alert('Delete Item', 'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', onPress: () => {
                        const updatedItems = selectedImageArray.filter((item) => item !== image)
                        setSelectedImageArray([...updatedItems])
                        setSelectedImageToUpload([...updatedItems])
                    },
                },
            ],
            { cancelable: false }
        )
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

    const handleDeleteIngredient = (newIngredient: Ingredient) => {
        const updatedIngredients = selectedIngredients.filter((ingredient) => ingredient.name !== newIngredient.name)
        setSelectedIngredients(updatedIngredients)
    }

    const handlePressToEdit = (ingredient: Ingredient) => {
        setIngredientEdit(ingredient)
        setIngredientsModalVisible(true)
    }

    const handleClose = () => {
        setIngredientsModalVisible(false)
        setIngredientEdit({})
    }

    const handleNextStep = (text: string) => {
        if(text === '') return
        let numberOfSteps = stepList.length
        setStepList([...stepList, {number: ++numberOfSteps, description: text}])
        setStep('')
        setStepsPlaceholder('Add next step')
    }

    const handleChangeText = (text: string, index: number) => {
        setStepList(prevStepList => {
            const updatedStepList = [...prevStepList]
            const updatedString = text.split('. ')[1] || ''
            updatedStepList[index] = { ...updatedStepList[index], description: updatedString }
            return updatedStepList
        })
    }

    const renderItem = ({ item }: { item: string }) => {
        return (
            <View>
                {
                    item === PlaceholderImage ? (
                        <Pressable style={[styles.images, { width: screenWidth, height: screenHeight / 3, }]} onPress={pickImageAsync}>
                            <MaterialIcons name="add-photo-alternate" size={128} color={COLORS.lightDark} />
                        </Pressable>
                    ) : (
                        <Pressable style={[styles.images, { width: screenWidth, height: 2 * screenHeight / 3 }]} onLongPress={() => handleDeleteImage(item)}>
                            <Image source={{ uri: item }} style={[styles.image, { width: screenWidth, height: 2 * screenHeight / 3 }]} />
                        </Pressable>
                    )
                }
            </View>
        )
    }

    return (
        <BackgroundSafeAreaView>
            <View style={styles.scrollViewContent}>
                <View style={[styles.flex, { flexDirection: 'row'}]}>
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
                    keyboardBehavior='extend'
                >
                    <BottomSheetScrollView 
                        showsVerticalScrollIndicator={false} 
                        contentContainerStyle={styles.scrollViewContent}
                        keyboardShouldPersistTaps={'handled'}
                        >
                        <Text style={styles.subtitleText}>Recipe name</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="receipt" style={styles.icon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Recipe name"
                                value={title}
                                autoComplete='off'
                                onChangeText={text => setTitle(text)}
                            />
                        </View>

                        <Text style={styles.subtitleText}>Serving size</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="people" style={styles.icon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Serving size"
                                value={servingSize}
                                onChangeText={text => setServingSize(text)}
                                keyboardType='numeric'
                            />
                        </View>

                        <Text style={styles.subtitleText}>Time to prepare</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="timelapse" style={styles.icon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Time to prepare"
                                value={cookingTime}
                                onChangeText={text => setCookingTime(text)}
                                keyboardType='numeric'
                            />
                        </View>

                        <Text style={styles.subtitleText}>Ingredients</Text>
                        {selectedIngredients?.map((ingredient, index) => (
                            <Pressable key={index} style={styles.ingredientItem} onPress={() => handlePressToEdit(ingredient)}>
                                <Text style={[styles.textInput, { width: "auto" }]}>   {ingredient.name}   -   {ingredient.amount} {ingredient.unit}</Text>
                                <Pressable onPress={() => handleDeleteIngredient(ingredient)}>
                                    <MaterialIcons name="delete" style={styles.icon} />
                                </Pressable>
                            </Pressable>
                        ))}
                        <Pressable style={styles.button} onPress={() => setIngredientsModalVisible(true)}>
                            <Text style={styles.buttonText}>Add ingredients</Text>
                        </Pressable>

                        <Text style={styles.subtitleText}>Cooking instructions</Text>
                        {stepList?.map((step, index) => (
                            <TextInput
                                style={styles.input}
                                multiline={true}
                                value={`${step.number}. ${step.description}`}
                                autoComplete='off'
                                onChangeText={(text) => handleChangeText(text, index)}
                                key={step.number}
                            />
                        ))}
                        <TextInput
                            style={styles.input}
                            placeholder={`${stepsPlaceholder}`}
                            value={step}
                            autoComplete='off'
                            onChangeText={(text) => setStep(text)}
                            onEndEditing={() => handleNextStep(step)}
                        />

                        <Pressable style={styles.button} onPress={handleCreateRecipe}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </Pressable>
                    </BottomSheetScrollView>
                </BottomSheet>

                <AddIngredientsModal
                    visible={ingredientsModalVisible}
                    dataEdit={ingredientEdit}
                    onAdd={handleAddIngredient}
                    onClose={handleClose} />
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
        height: 60,
        backgroundColor: COLORS.light,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    textInput: {
        width: '100%',
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
        marginBottom: 0.5 * SIZES.base,
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
})