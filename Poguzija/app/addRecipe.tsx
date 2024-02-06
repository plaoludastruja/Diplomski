import BackgroundSafeAreaView from '../components/BackgroundSafeAreaView';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Image, Platform, ScrollView, KeyboardAvoidingView, Alert, Dimensions, Modal, FlatList, Button } from 'react-native';
import { db, storage } from '../service/firebase';
import { AddFoodRecipe, UploadFoodRecipesImages } from '../service/service';
import { FoodRecipes, Ingredient, Step, StorageFolder } from '../model/model';
import { serverTimestamp } from 'firebase/firestore/lite';
import ImageViewer from '../components/ImageViewer';
const PlaceholderImage = require('../assets/images/icon.png');
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { ref, uploadBytes } from 'firebase/storage';
import Carousel from 'react-native-snap-carousel';
import { COLORS, SIZES } from '../constants/Colors';
import AddIngredientsModal from '../components/AddIngredientsModal';
import BottomSheet, { BottomSheetFlatList, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import * as SecureStore from 'expo-secure-store';
import { getCurrentUser } from '../service/AuthService';


export default function AddRecipeScreen() {

    useEffect(() => {
        getCurrentUser();
    },[])
    


    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const [snapPoints, setSnapPoints] = useState(['66', '95']);

    const [ingredientsModalVisible, setIngredientsModalVisible] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);

    const [selectedImageArray, setSelectedImageArray] = useState<string[]>([PlaceholderImage])
    const [selectedImageToUpload, setSelectedImageToUpload] = useState<string[]>([])

    const [title, setTitle] = useState('');
    const [servingSize, setServingSize] = useState('');
    const [author, setAuthor] = useState('');

    const [stepList, setStepList] = useState<Step[]>([]);
    const [step, setStep] = useState('');
    const [stepsPlaceholder, setStepsPlaceholder] = useState('Add first step');

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImageArray([...selectedImageArray.slice(0, -1), result.assets[0].uri, PlaceholderImage]);
            setSelectedImageToUpload([...selectedImageToUpload, result.assets[0].uri]);
            setSnapPoints(['35', '65', '95'])
        }
    };

    const handleCreateRecipe = async () => {
        const updatedStepList = step !== '' ? [...stepList, { number: stepList.length + 1, description: step }] : stepList;
        try {
            const uploadedImages = await UploadFoodRecipesImages(selectedImageToUpload, StorageFolder.FoodRecipesPhotos)
            const newRecipe: Partial<FoodRecipes> = {
                title: title,
                author: author,
                servingSize: servingSize,
                images: uploadedImages,
                ingredients: selectedIngredients,
                steps: updatedStepList
            };
            AddFoodRecipe(newRecipe);

            setTitle('');
            setAuthor('');
            setStepList([]);
            setServingSize('');
            setSelectedIngredients([]);
            setSelectedImageToUpload([]);
            setSelectedImageArray([PlaceholderImage]);
            console.log('Recipe created successfully');
        } catch (error) {
            console.error('Error creating recipe:', error);
        }
    };

    const handleDeleteImage = (image: string) => {
        Alert.alert('Delete Item', 'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', onPress: () => {
                        const updatedItems = selectedImageArray.filter((item) => item !== image);
                        setSelectedImageArray([...updatedItems]);
                        setSelectedImageToUpload([...updatedItems]);
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleAddIngredient = (ingredient: Ingredient) => {
        setSelectedIngredients([...selectedIngredients, ingredient]);
    };

    const handleDeleteIngredient = (index: number) => {
        const updatedIngredients = selectedIngredients.filter((_, i) => i !== index);
        setSelectedIngredients(updatedIngredients);
    };

    const handleNextStep = (text: string) => {
        let numberOfSteps = stepList.length
        setStepList([...stepList, {number: ++numberOfSteps, description: text}])
        setStep('');
        setStepsPlaceholder('Add next step')
    };

    const handleChangeText = (text: string, index: number) => {
        setStepList(prevStepList => {
            const updatedStepList = [...prevStepList];
            const updatedString = text.split('. ')[1] || '';
            updatedStepList[index] = { ...updatedStepList[index], description: updatedString };
            return updatedStepList;
        });
    };

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
                            <Image source={{ uri: item }} style={[styles.image, { width: screenWidth }]} />
                        </Pressable>
                    )
                }
            </View>
        );
    };

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
                    <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.subtitleText}>Recipe name</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="receipt" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder="Recipe name"
                                value={title}
                                onChangeText={text => setTitle(text)}
                            />
                        </View>

                        <Text style={styles.subtitleText}>Serving size</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="people" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder="Serving size"
                                value={servingSize}
                                onChangeText={text => setServingSize(text)}
                                keyboardType='numeric'
                            />
                        </View>

                        <Text style={styles.subtitleText}>Ingredients</Text>
                        {selectedIngredients?.map((ingredient, index) => (
                            <View key={index} style={styles.ingredientItem}>
                                <Text style={[styles.textInput, { width: "auto" }]}>   {ingredient.name}   -   {ingredient.amount} {ingredient.unit}</Text>
                                <Pressable onPress={() => handleDeleteIngredient(index)}>
                                    <MaterialIcons name="delete" style={styles.icon} />
                                </Pressable>
                            </View>
                        ))}
                        <Pressable style={styles.button} onPress={() => setIngredientsModalVisible(true)}>
                            <Text style={styles.buttonText}>Add ingredients</Text>
                        </Pressable>

                        <Text style={styles.subtitleText}>Cooking instructions</Text>
                        {stepList?.map((step, index) => (
                            <BottomSheetTextInput
                                style={styles.input}
                                multiline={true}
                                value={`${step.number}. ${step.description}`}
                                onChangeText={(text) => handleChangeText(text, index)}
                                key={step.number}
                            />
                        ))}
                        <BottomSheetTextInput
                            style={styles.input}
                            placeholder={`${stepsPlaceholder}`}
                            value={step}
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
                    onAdd={handleAddIngredient}
                    onClose={() => setIngredientsModalVisible(false)} />
            </View>
        </BackgroundSafeAreaView>
    );
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
        height: 500,
        marginBottom: SIZES.extraLarge
    },
    image: {
        height: 500,
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
    inputContainer2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '95%',
        height: 60,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    inputContainerMeasurment: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '49%',
        height: 60,
        backgroundColor: COLORS.light,
        borderTopStartRadius: SIZES.extraLarge,
        borderBottomStartRadius: SIZES.extraLarge,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    inputContainerMeasurment2: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '49%',
        height: 60,
        backgroundColor: COLORS.light,
        borderTopEndRadius: SIZES.extraLarge,
        borderBottomEndRadius: SIZES.extraLarge,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    inputContainer1: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '45%',
        height: 60,
        backgroundColor: COLORS.light,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
        margin: 10
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
        marginBottom: SIZES.base,
        marginTop: SIZES.small
    },

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '80%',
        backgroundColor: COLORS.dark,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.large,
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalView1: {
        width: '80%',
        height: '80%',
        backgroundColor: COLORS.darkLight,
        borderRadius: SIZES.extraLarge,
        padding: 2 * SIZES.large,
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
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
    ingredientInfo: {
        flex: 1,
    },
    deleteIcon: {
        fontSize: 24,
        color: 'red',
    },
});