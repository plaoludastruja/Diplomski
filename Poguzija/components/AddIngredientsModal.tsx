import { Text, StyleSheet, View, Modal, Pressable, TextInput } from 'react-native'
import React, { Component, FC, useEffect, useState } from 'react'
import { Ingredient, MyComponentProps } from '../model/model'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../constants/Colors'
import SelectIngredientList from './SelectIngredientList'
import { GetIngredients, GetUnits } from '../service/IngredientService'
import { TranslationKeys } from '../locales/_translationKeys'
import { useTranslation } from 'react-i18next'

const AddIngredientsModal = ({ visible, dataEdit, onAdd, onClose }) => {
    const {t} = useTranslation()
    const [modalVisible, setModalVisible] = useState(false)
    const [modalDataType, setModalDataType] = useState('')

    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [unit, setUnit] = useState('')

    const openModal = (dataType) => {
        setModalDataType(dataType)
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalDataType('')
        setModalVisible(false)
    }

    useEffect(() => {
        setName(dataEdit?.name)
        setAmount(dataEdit?.amount)
        setUnit(dataEdit?.unit)
    },[dataEdit])

    const handleOnAdd = () => {
        const ingredient : Ingredient = {
            name: name,
            amount: amount,
            unit: unit
        }
        onAdd(ingredient)
        setName('')
        setAmount('')
        setUnit('')
        onClose()
    }

    return (
        <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={ onClose }>
            <Pressable style={styles.flex} onPress={ onClose }>
                <Pressable style={styles.modalView}>
                    <Pressable style={styles.nameInput} onPress={() => {if(!dataEdit?.name) openModal('ingredient')}}>
                        <MaterialIcons name="search" style={styles.icon} />
                        <TextInput value={name} placeholder={t(TranslationKeys.Ingredient.NAME)} editable={false} style={styles.textInput} />
                    </Pressable>
                    <View style={styles.amountAndUnitContainer}>
                        <View style={[styles.amountAndUnitInput, styles.amountInput]}>
                            <TextInput value={amount} placeholder={t(TranslationKeys.Ingredient.AMOUNT)} style={styles.textInput} keyboardType='numeric' onChangeText={text => setAmount(text)} />
                        </View>
                        <Pressable style={[styles.amountAndUnitInput, styles.unitInput]} onPress={() => openModal('unit')}>
                            <TextInput value={unit} placeholder={t(TranslationKeys.Ingredient.UNIT)} editable={false} style={styles.textInput} onChangeText={text => setUnit(text)} />   
                        </Pressable>
                    </View>
                    <Pressable style={ styles.button } onPress={ handleOnAdd }>
                        <Text style={ styles.buttonText }>{t(TranslationKeys.Button.ADD)}</Text>
                    </Pressable>
                </Pressable>
            </Pressable>

            <SelectIngredientList 
                modalDataType={ modalDataType }
                visible={ modalVisible } 
                onAdd={ (item) => { if(modalDataType === 'ingredient'){setName(item.name)} else if(modalDataType === 'unit'){setUnit(item.name)} }} 
                onClose={() => closeModal()} />
            
            
        </Modal>
    )
}


const styles = StyleSheet.create({
    flex: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
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
    nameInput: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        height: 60,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    amountAndUnitContainer: {
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
    amountAndUnitInput: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '49%',
        height: 60,
        backgroundColor: COLORS.white,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    amountInput: {
        borderTopStartRadius: SIZES.extraLarge,
        borderBottomStartRadius: SIZES.extraLarge,
    },
    unitInput: {
        borderTopEndRadius: SIZES.extraLarge,
        borderBottomEndRadius: SIZES.extraLarge,
    },
    textInput: {
        width: '100%',
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    icon: {
        marginRight: 10,
        color: COLORS.lightDark,
        fontSize: SIZES.extraLarge
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
})

export default AddIngredientsModal