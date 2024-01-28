import { Text, StyleSheet, View, Modal, Pressable, TextInput, FlatList } from 'react-native'
import React, { Component, FC, useState } from 'react'
import { MyComponentProps } from '../model/model'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../constants/Colors'

const SelectIngredientList = ({ data, visible, onAdd, onClose }) => {
    const handlePress = (ingredient) => {
        onAdd(ingredient);
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={ onClose }>
            <Pressable style={styles.centeredView} onPress={ onClose }>
                <View style={styles.modalView}>
                    <FlatList
                        data={data}
                        renderItem={({ item }) =>
                            <Pressable
                                style={styles.buttonModal}
                                onPress={ () => handlePress(item.id) }>
                                <Text style={styles.textStyle}>{item.id}</Text>
                            </Pressable>}
                        keyExtractor={item => item.id}
                    />
                </View>
            </Pressable>
        </Modal>
    )
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: COLORS.darkLight,
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
    buttonModal: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: COLORS.tint,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SelectIngredientList