import { Text, StyleSheet, View, Modal, Pressable, TextInput, FlatList } from 'react-native'
import React, { Component, FC, useEffect, useState } from 'react'
import { Category, Ingredient, MyComponentProps } from '../model/model'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../constants/Colors'
import SelectIngredientList from './SelectIngredientList'
import { GetIngredients, GetUnits } from '../service/IngredientService'
import { GetCategoryData } from '../service/HelperService'

export const AddCategoryModal = ({ visible, onClose }) => {
    const [category, setCategory] = useState<Category[]>()
    const handlePress = (type: string, name: string) => {
        setCategory(prevCategories => prevCategories?.map(cat => cat.type === type ? { ...cat, data: cat.data.map(item => item.name === name ? { ...item, isSelected: !item.isSelected } : item )}: cat ))
    }

    const handleClose = () => {
        const categoryData = category
        const searchFields = categoryData?.map(i => i.data.filter(j => j.isSelected).map(j => j.name)).flat();
        onClose(searchFields)
    }

    useEffect(() => {
        const categoryData = GetCategoryData()
        setCategory(categoryData)
    },[])

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={ () => handleClose() }>
            <Pressable style={styles.centeredView} onPress={ () => handleClose() }>
                <View style={styles.modalView}>
                    <FlatList
                        data={category}
                        showsVerticalScrollIndicator={false}
                        style={styles.flex}
                        renderItem={({ item }) => 
                            <View>
                                <Text style={styles.subtitleText}>{item.type}</Text>
                                { item.data?.map((categoryData, index) => (
                                    <Pressable
                                        style={ categoryData.isSelected ? styles.buttonModalSelected : styles.buttonModal }
                                        onPress={ () => handlePress(item.type, categoryData.name) }>
                                        <Text style={styles.textStyle}>{categoryData.name}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        }                          
                        keyExtractor={item => item.type}
                    />
                </View>
            </Pressable>
        </Modal>
    )
}


const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '100%'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        height: '80%',
        width: '80%',
        backgroundColor: COLORS.darkLight,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.small,
        alignItems: 'center',
        shadowColor: COLORS.dark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonModal: {
        borderRadius: 20,
        padding: 10,
        marginVertical: 0.2 * SIZES.base,
        width: '100%',
        elevation: 2,
        backgroundColor: COLORS.tint,
    },
    buttonModalSelected: {
        borderRadius: 20,
        padding: 10,
        marginVertical: 0.2 * SIZES.base,
        width: '100%',
        elevation: 2,
        backgroundColor: COLORS.dark,
    },
    textStyle: {
        width: '100%',
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
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
})

