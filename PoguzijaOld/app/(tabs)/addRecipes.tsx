import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView';
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { db } from '../../service/firebase';
import { AddFoodRecipe } from '../../service/service';
import { FoodRecipes } from '../../model/model';
import { serverTimestamp } from 'firebase/firestore/lite';
import ImageViewer from '../../components/ImageViewer';
const PlaceholderImage = require('../../assets/images/icon.png');
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


export default function AddRecipesScreen() {

    const [author, setAuthor] = useState('');
    const [title, setTitle] = useState('');
    const [steps, setSteps] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showAppOptions, setShowAppOptions] = useState(false);
    const [pickedEmoji, setPickedEmoji] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true);
        } else {
            alert('You did not select any image.');
        }
    };
    const handleCreateRecipe = async () => {
        try {
            const newRecipe: Partial<FoodRecipes> = {
                author: author,
                title: title,
                steps: steps,
            };

            //await addDoc(collection(db, 'foodRecipes'), newRecipe);
            await AddFoodRecipe(newRecipe);
            // Clear the input fields after submission
            setAuthor('');
            setTitle('');
            setSteps('');

            console.log('Recipe created successfully');
        } catch (error) {
            console.error('Error creating recipe:', error);
        }
    };

    return (
        <BackgroundSafeAreaView>
            {/*<ImageViewer selectedImage={PlaceholderImage} />
            <Image source={PlaceholderImage} style={styles.image} />*/}
            <TouchableOpacity style={styles.iconButton} onPress={pickImageAsync}>
                <MaterialIcons name="add-photo-alternate" size={24} color="black" />
            </TouchableOpacity>

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
            <TouchableOpacity style={styles.button} onPress={handleCreateRecipe}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
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
        width: 320,
        height: 440,
        borderRadius: 18,
    }, iconButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconButtonLabel: {
        color: '#fff',
        marginTop: 12,
    },
});