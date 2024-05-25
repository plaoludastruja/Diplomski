import { Text, StyleSheet, View, Modal, Pressable, TextInput, FlatList } from 'react-native'
import React, { Component, FC, useState } from 'react'
import { MyComponentProps } from '../model/model'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../constants/Colors'

const SelectIngredientList = ({ data, visible, onAdd, onClose }) => {
    const [search, setSearch] = useState('')
    const [dataFilter, setDataFilter] = useState(data);

    const handlePress = (ingredient) => {
        onAdd(ingredient);
        onClose();
    };

    const filterData = (search: string) => {
        const filteredData = search ==='' ? data : data.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
        setDataFilter(filteredData)
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={ onClose }>
            <Pressable style={styles.centeredView} onPress={ onClose }>
                <View style={styles.modalView}>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="search" style={styles.icon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Search"
                            value={search}
                            autoComplete='off'
                            onChangeText={text => {
                                setSearch(text);
                                filterData(text);
                            }}
                        />
                    </View>
                    <FlatList
                        data={dataFilter}
                        showsVerticalScrollIndicator={false}
                        style={styles.flex}
                        renderItem={({ item }) =>
                            <Pressable
                                style={styles.buttonModal}
                                onPress={ () => handlePress(item) }>
                                <Text style={styles.textStyle}>{item.name}</Text>
                            </Pressable>}
                        keyExtractor={item => item.id}
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
});

export default SelectIngredientList