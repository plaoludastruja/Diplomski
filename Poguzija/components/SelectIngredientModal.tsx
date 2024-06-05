import { Text, StyleSheet, View, Modal, Pressable, TextInput, FlatList } from 'react-native'
import React, { Component, FC, useEffect, useState } from 'react'
import { Category, SelectedIngredient } from '../model/model'
import { COLORS, SIZES } from '../constants/Colors'
import { GetCategoryData } from '../service/HelperService'
import { GetIngredients } from '../service/IngredientService'
import constructWithOptions from 'styled-components/dist/constructors/constructWithOptions'
import { MaterialIcons } from '@expo/vector-icons'

export const SelectIngredientModal = ({ alreadySelected, visible, onClose }) => {
    const [selectedIngredient, setSelectedIngredient] = useState<SelectedIngredient[]>()
    const [search, setSearch] = useState('')
    const [dataFilter, setDataFilter] = useState<SelectedIngredient[]>([])

    const handlePress = (name: string) => {
        setSelectedIngredient(prevIngredients => prevIngredients?.map(i => i.name === name ? {...i,isSelected: !i.isSelected } : i ))
        setDataFilter(prevIngredients => prevIngredients?.map(i => i.name === name ? {...i,isSelected: !i.isSelected } : i ))
    }

    const handleClose = () => {
        const ingredientyData = selectedIngredient
        const searchFields = ingredientyData?.filter(j => j.isSelected).map(j => j.name)
        onClose(searchFields)
        setSearch('')
        setDataFilter([])
    }

    const filterData = (search: string) => {
        const filteredData = search === '' ? selectedIngredient : selectedIngredient?.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase())
        )
        setDataFilter(filteredData)
    }

    useEffect(() => {
        console.log('inger', alreadySelected, selectedIngredient)
        if(alreadySelected && selectedIngredient){
            const alreadySelectedData = selectedIngredient.map(cat => ({...cat,
                    isSelected: alreadySelected.includes(cat.name),
                }))
            setSelectedIngredient(alreadySelectedData)
            setDataFilter(alreadySelectedData)
        }else{
            fetchData()
        }
    },[alreadySelected])

    const fetchData = async () => {
        const ingredients = await GetIngredients()
        console.log(ingredients)
        const ingredientsData = ingredients?.map(i => ({...i, isSelected: false}))
        setSelectedIngredient(ingredientsData)
        setDataFilter(ingredientsData)
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={ () => handleClose() }>
            <Pressable style={styles.centeredView} onPress={ () => handleClose() }>
                <View style={styles.modalView}>
                <View style={styles.inputContainer}>
                        <MaterialIcons name="search" style={styles.icon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Search"
                            value={search}
                            autoComplete='off'
                            onChangeText={text => {
                                setSearch(text)
                                filterData(text)
                            }}
                        />
                    </View>
                    <FlatList
                        data={dataFilter}
                        showsVerticalScrollIndicator={false}
                        style={styles.flex}
                        renderItem={({ item }) => 
                            <View>
                                <Pressable
                                    style={ item.isSelected ? styles.buttonModalSelected : styles.buttonModal }
                                    onPress={ () => handlePress(item.name) }>
                                    <Text style={styles.textStyle}>{item.name}</Text>
                                </Pressable>
                            </View>
                        }                          
                        keyExtractor={item => item.name}
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
        color: COLORS.light,
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

