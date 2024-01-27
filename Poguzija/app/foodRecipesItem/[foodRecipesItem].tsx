import { useLocalSearchParams } from 'expo-router';
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView';
import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Image, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { FoodRecipes, StorageFolder } from '../../model/model';
const PlaceholderImage = require('../../assets/images/icon.png');
import Carousel from 'react-native-snap-carousel';
import { COLORS, SIZES } from '../../constants/Colors';
import { GetFoodRecipe } from '../../service/service';


export default function FoodRecipesItem() {
    const { foodRecipesItem } = useLocalSearchParams<{ foodRecipesItem: string }>();
    const [food, setFood] = useState<FoodRecipes>();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const foodRecipesData = await GetFoodRecipe(foodRecipesItem);
            setFood(foodRecipesData)
            console.log('Data fetched: ', foodRecipesData)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    const renderItem = ({ item }: { item: string }) => {
        return (
            <Image source={{ uri: item }} style={styles.image} />

        );
    };
    return (
        <BackgroundSafeAreaView>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                        <Carousel
                            data={ (food?.images) ? food?.images : []}
                            renderItem={renderItem}
                            sliderWidth={300} // Adjust the width as needed
                            itemWidth={250}  // Adjust the item width as needed
                            layout="default"
                        />
                    </View>
                    {/*<Image source={imageSource} style={styles.image} />
                    <Pressable style={styles.iconButton} onPress={pickImageAsync}>
                        <MaterialIcons name="add-photo-alternate" size={24} color="black" />
                    </Pressable>*/}

                    
                </ScrollView>
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