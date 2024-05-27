import { useLocalSearchParams } from 'expo-router';
import BackgroundSafeAreaView from '../../components/BackgroundSafeAreaView';
import React, { useEffect, useMemo, useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Image, Platform, ScrollView, KeyboardAvoidingView, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { FoodRecipes, Ingredient, Step, StorageFolder } from '../../model/model';
const PlaceholderImage = require('../../assets/images/icon.png');
import Carousel from 'react-native-snap-carousel';
import { COLORS, SIZES } from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import AddIngredientsModal from '../../components/AddIngredientsModal';
import LoadingScreen from '../../components/LoadingScreen';
import { GetFoodRecipe } from '../../service/RecipesService';


export default function FoodRecipesItem() {
    const { foodRecipesItem } = useLocalSearchParams<{ foodRecipesItem: string }>();
    const [food, setFood] = useState<FoodRecipes>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const foodRecipesData = await GetFoodRecipe(foodRecipesItem);
            setFood(foodRecipesData)
            setLoading(false)
            console.log('Data fetched: ', foodRecipesData)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;


    const renderItem = ({ item }: { item: string }) => {
        return (
            <View style={[styles.images, { width: screenWidth, height: 2 * screenHeight / 3 }]} >
                <Image source={{ uri: item }} style={[styles.image, { width: screenWidth, height: 2 * screenHeight / 3 }]} />
            </View>
        );
    };

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
                </View>

                <BottomSheet
                    snapPoints={['35', '65', '95']}
                    backgroundStyle={{ backgroundColor: COLORS.dark }}
                >
                    <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                        <Text style={styles.subtitleText}>Recipe name</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="receipt" style={styles.icon} />
                            <BottomSheetTextInput
                                style={styles.textInput}
                                placeholder="Recipe name"
                                value={food?.title}
                                autoComplete='off'
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
                    </BottomSheetScrollView>
                </BottomSheet>

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
});