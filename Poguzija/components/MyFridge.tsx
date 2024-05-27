import { Text, StyleSheet, View, Image, Pressable, TextInput } from 'react-native'
import React, { Component, FC, useContext, useEffect, useState } from 'react'
import { Ingredient, MyComponentProps, MyUser } from '../model/model'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { COLORS, SIZES } from '../constants/Colors'
import SelectDropdown from 'react-native-select-dropdown'
import { getCurrentUser } from '../service/UserService'
import { signIn, signOut } from '../service/AuthService'
import { UserContext } from '../app/_layout'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import AddIngredientsModal from './AddIngredientsModal'

export default function MyFridge() {
    const { user, signInFn, signOutFn } = useContext(UserContext)
    const [ingredientsModalVisible, setIngredientsModalVisible] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);

    const handleAddIngredient = (ingredient: Ingredient) => {
        setSelectedIngredients([...selectedIngredients, ingredient]);
    };
    const handleDeleteIngredient = (index: number) => {
        const updatedIngredients = selectedIngredients.filter((_, i) => i !== index);
        setSelectedIngredients(updatedIngredients);
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.button} onPress={() => setIngredientsModalVisible(true)}>
                <Text style={styles.buttonText}>Add ingredients</Text>
            </Pressable>
            {selectedIngredients?.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                    <Text style={[styles.textInput, { width: "auto" }]}>   {ingredient.name}   -   {ingredient.amount} {ingredient.unit}</Text>
                    <Pressable onPress={() => handleDeleteIngredient(index)}>
                        <MaterialIcons name="delete" style={styles.icon} />
                    </Pressable>
                </View>
            ))}
            <AddIngredientsModal
                visible={ingredientsModalVisible}
                onAdd={handleAddIngredient}
                onClose={() => setIngredientsModalVisible(false)} />
        </View>
        
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    header: {
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 5 * SIZES.extraLarge,
        height: 2 * SIZES.extraLarge,
    },
    image: {
        width: 1.2 * SIZES.tabIcon,
        height: 1.2 * SIZES.tabIcon,
        borderRadius: SIZES.large,
        margin: SIZES.base
    },
    subtitleText: {
        width: '85%',
        color: COLORS.tint,
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        marginBottom: 0.5 * SIZES.base,
        alignSelf: 'flex-start'
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: SIZES.large,
    },
    flex: {
        flex: 1,
        width: '100%',
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

    dropdownButtonStyle: {
        width: 200,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },

    
    ingredientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        height: 60,
        backgroundColor: COLORS.dark,
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
});

