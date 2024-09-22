import { Text, StyleSheet, View, Modal, Pressable, TextInput, FlatList } from 'react-native'
import React, { Component, FC, useEffect, useState } from 'react'
import { Category, Day, SelectedIngredient } from '../model/model'
import { COLORS, SIZES } from '../constants/Colors'
import { GetCategoryData } from '../service/HelperService'
import { GetIngredients } from '../service/IngredientService'
import constructWithOptions from 'styled-components/dist/constructors/constructWithOptions'
import { MaterialIcons } from '@expo/vector-icons'

export const SelectWeekModal = ({ visible, onClose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={ () => onClose() }>
            <Pressable style={styles.centeredView} onPress={ () => onClose() }>
                <View style={styles.modalView}>
                    { Object.values(Day)?.map((value, _) => (
                            <Pressable
                                style={ styles.buttonModal }
                                onPress={ () => onClose(value) }>
                                <Text style={styles.textStyle}>{value}</Text>
                            </Pressable>
                        ))}
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
        height: 'auto',
        width: '80%',
        backgroundColor: COLORS.light,
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
        color: COLORS.white,
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

