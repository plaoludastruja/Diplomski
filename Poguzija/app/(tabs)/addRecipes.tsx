import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView';
import React, { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
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

    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [steps, setSteps] = useState('');

    const [selectedImageArray, setSelectedImageArray] = useState<string[]>([PlaceholderImage])
    const [selectedImageToUpload, setSelectedImageToUpload] = useState<string[]>([])

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
            console.log(1)
            const newRecipe: Partial<FoodRecipes> = {
                author: author,
                title: title,
                steps: steps,
                images: uploadedImages
            };
            await AddFoodRecipe(newRecipe);
            // Clear the input fields after submission
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
    const renderItem = ( {item}: {item: string} ) => {
        return(
            <View>
                {
                    item === PlaceholderImage ? (
                        <TouchableOpacity style={styles.iconButton} onPress={pickImageAsync}>
                            <MaterialIcons name="add-photo-alternate" size={62} color={COLORS.darkLight} />
                        </TouchableOpacity>
                    ) : (
                    <Image source={{ uri: item }} style={styles.image} />
                    )
                }
            </View>
            
        );
    };
    return (
        <BackgroundSafeAreaView>
            <KeyboardAvoidingView behavior='padding' style={styles.flex}>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                        <Carousel
                            data={selectedImageArray}
                            renderItem={renderItem}
                            sliderWidth={300} // Adjust the width as needed
                            itemWidth={250}  // Adjust the item width as needed
                            layout="default"
                        />
                    </View>
                    {/*<Image source={imageSource} style={styles.image} />
                    <TouchableOpacity style={styles.iconButton} onPress={pickImageAsync}>
                        <MaterialIcons name="add-photo-alternate" size={24} color="black" />
                    </TouchableOpacity>*/}

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
                    <TouchableOpacity style={styles.button} onPress={handleCreateRecipe}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </BackgroundSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
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
    image: {
        width: 300,
        height: 250,
        borderRadius: 18,
        marginTop: SIZES.extraLarge
    },
    iconButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 250,
    },
    iconButtonLabel: {
        color: '#fff',
        marginTop: 12,
    },
    flex: {
        flex: 1,
        width: '100%',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});