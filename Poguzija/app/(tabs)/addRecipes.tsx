import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView';
import React, { useRef, useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Image, Platform, ScrollView, KeyboardAvoidingView, Alert, Dimensions } from 'react-native';
import { db, storage } from '../../service/firebase';
import { AddFoodRecipe, UploadFoodRecipesImages } from '../../service/service';
import { FoodRecipes, StorageFolder } from '../../model/model';
import { serverTimestamp } from 'firebase/firestore/lite';
import ImageViewer from '../../components/ImageViewer';
const PlaceholderImage = require('../../assets/images/icon.png');
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { ref, uploadBytes } from 'firebase/storage';
import Carousel from 'react-native-snap-carousel';
import { COLORS, SIZES } from '../../constants/Colors';


export default function AddRecipesScreen() {
    const screenWidth = Dimensions.get('window').width;

    const [selectedImageArray, setSelectedImageArray] = useState<string[]>([PlaceholderImage])
    const [selectedImageToUpload, setSelectedImageToUpload] = useState<string[]>([])

    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [steps, setSteps] = useState('');

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            quality: 1,
        });
        
        if (!result.canceled) {
            setSelectedImageArray([ ...selectedImageArray.slice(0, -1), result.assets[0].uri, PlaceholderImage]);
            setSelectedImageToUpload([ ...selectedImageToUpload, result.assets[0].uri]);
        }
    };

    const handleCreateRecipe = async () => {
        try {
            
            const uploadedImages = await UploadFoodRecipesImages(selectedImageToUpload, StorageFolder.FoodRecipesPhotos)
            const newRecipe: Partial<FoodRecipes> = {
                author: author,
                title: title,
                steps: steps,
                images: uploadedImages
            };
            await AddFoodRecipe(newRecipe);

            setAuthor('');
            setTitle('');
            setSteps('');
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
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete', onPress: () => {
                        const updatedItems = selectedImageArray.filter((item) => item !== image);
                        setSelectedImageArray([ ...updatedItems]);
                        setSelectedImageToUpload([ ...updatedItems]);
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const renderItem = ( { item } : { item: string } ) => {
        return(
            <View>
                {
                    item === PlaceholderImage ? (
                        <Pressable style={[styles.images, { width: screenWidth }]} onPress={ pickImageAsync }>
                            <MaterialIcons name="add-photo-alternate" size={62} color={COLORS.darkLight} />
                        </Pressable>
                    ) : (
                        <Pressable style={[styles.images, {width: screenWidth}]} onLongPress={() => handleDeleteImage(item)}>
                            <Image source={{ uri: item }} style={[styles.image, { width: screenWidth }]} />
                        </Pressable>
                    )
                }
            </View>
        );
    };
    return (
        <BackgroundSafeAreaView>
            <KeyboardAvoidingView behavior='padding' style={ styles.flex }>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                    <View style={[styles.flex, { flexDirection: 'row' }]}>
                        <Carousel
                            data={selectedImageArray}
                            renderItem={renderItem}
                            sliderWidth={screenWidth}
                            itemWidth={screenWidth}
                            layout="default"
                        />
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Author"
                        value={author}
                        onChangeText={text => setAuthor(text)}
                    />
                    {/* Add similar TextInput components for 'createdAt', 'image', and 'steps' */}
                    <TextInput
                        style={styles.input}
                        placeholder="Naslovi"
                        value={title}
                        onChangeText={text => setTitle(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Steps"
                        value={steps}
                        onChangeText={text => setSteps(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Steps"
                        value={steps}
                        onChangeText={text => setSteps(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Steps"
                        value={steps}
                        onChangeText={text => setSteps(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Steps"
                        value={steps}
                        onChangeText={text => setSteps(text)}
                    />
                    <Pressable style={styles.button} onPress={handleCreateRecipe}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </BackgroundSafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '100%',
        justifyContent: 'center'
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    images: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 500
    },
    image: {
        height: 500,
        borderTopLeftRadius: SIZES.extraLarge,
        borderTopRightRadius: SIZES.extraLarge,
        marginTop: SIZES.extraLarge
    },
    input: {
        width: '100%',
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        paddingLeft: 10,
    },
    button: {
        backgroundColor: 'blue',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
        width: '100%'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});