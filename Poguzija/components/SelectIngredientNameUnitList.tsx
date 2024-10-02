import { Text, StyleSheet, View, Modal, Pressable, TextInput, FlatList } from 'react-native'
import React, { Component, FC, useEffect, useState } from 'react'
import { IngredientNameUnit, MyComponentProps } from '../model/model'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../constants/Colors'
import { GetIngredientNameUnitCategory } from '../service/IngredientService'
import { TranslationKeys } from '../locales/_translationKeys'
import { useTranslation } from 'react-i18next'

export const SelectIngredientNameUnitList = ({ modalDataType, visible, onAdd, onClose }) => {
    const {t} = useTranslation()
    const [search, setSearch] = useState('')
    const [data, setData] = useState<IngredientNameUnit[]>([])
    const [dataFilter, setDataFilter] = useState<IngredientNameUnit[]>([])
    const [addButtonVisible, setAddButtonVisible] = useState(false)

    useEffect(() => {
        if(visible)
            fetchData()
    }, [visible])

    const fetchData = () => {
        if(modalDataType === 'ingredient'){
            GetIngredientsList()
        }else if(modalDataType === 'unit'){
            GetUnitsList()
        }
    }

    const GetIngredientsList = () => {
        const ingredients = GetIngredientNameUnitCategory('ingredient')
        setData(ingredients)
        setDataFilter(ingredients)
    }

    const GetUnitsList = () => {
        const units = GetIngredientNameUnitCategory('unit')
        setData(units)
        setDataFilter(units)
    }

    const handlePress = (ingredient) => {
        onAdd(ingredient)
        handleClose()
    }
    const handleClose = () => {
        setSearch('')
        setData([])
        setDataFilter([])
        setAddButtonVisible(false)
        onClose()
    }

    const filterData = (search: string) => {
        const filteredData = search === '' ? data : data.map(item => {
            const filteredInnerData = item.data.filter(itemData => {
                if(modalDataType === 'ingredient'){
                    return t(TranslationKeys.IngredientItem[itemData.name as keyof typeof TranslationKeys.IngredientItem]).toLowerCase().includes(search.toLowerCase())
                }else if(modalDataType === 'unit'){
                    return t(TranslationKeys.UnitItem[itemData.name as keyof typeof TranslationKeys.UnitItem]).toLowerCase().includes(search.toLowerCase())
                }
            })
            if (filteredInnerData.length > 0) {
                return {
                    ...item,
                    data: filteredInnerData
                }
            }
            return null
        }).filter(item => item !== null)
        setDataFilter(filteredData)
        setAddButtonVisible(filteredData.length === 0 && search !== '')
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={ () => handleClose() }>
            <Pressable style={styles.centeredView} onPress={ () => handleClose() }>
                <Pressable style={styles.modalView}>
                    <Pressable style={styles.inputContainer}>
                        <MaterialIcons name="search" style={styles.icon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder={t(TranslationKeys.Button.SEARCH)}
                            value={search}
                            autoComplete='off'
                            onChangeText={text => {
                                setSearch(text)
                                filterData(text)
                            }}
                        />
                    </Pressable>
                    { addButtonVisible && <Pressable style={ styles.buttonModal } onPress={() => handlePress({ name: search})} >
                        <Text style={ styles.textStyle }>{t(TranslationKeys.Button.ADD)}</Text>
                    </Pressable>}
                    <FlatList
                        data={dataFilter}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                        style={styles.flex}
                        keyExtractor={item => item.type}
                        renderItem={({ item }) =>
                            <View>
                                <Pressable>
                                    { modalDataType === 'ingredient' && <Text style={styles.subtitleText}>{t(TranslationKeys.IngredientType[item.type as keyof typeof TranslationKeys.IngredientType]) || item.type}</Text> }
                                    { modalDataType === 'unit' && <Text style={styles.subtitleText}>{t(TranslationKeys.UnitType[item.type as keyof typeof TranslationKeys.UnitType]) || item.type}</Text> }
                                </Pressable>
                                { item.data?.map((itemData, index) => (
                                    <Pressable
                                        style={ styles.buttonModal }
                                        onPress={ () => handlePress(itemData) }
                                        key={itemData.name}>
                                        { modalDataType === 'ingredient' && <Text style={styles.textStyle}>{t(TranslationKeys.IngredientItem[itemData.name as keyof typeof TranslationKeys.IngredientItem]) || itemData.name}</Text> }
                                        { modalDataType === 'unit' && <Text style={styles.textStyle}>{t(TranslationKeys.UnitItem[itemData.name as keyof typeof TranslationKeys.UnitItem]) || itemData.name}</Text> }
                                    </Pressable>
                                ))}
                            </View>
                        }
                    />
                </Pressable>
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
    textStyle: {
        width: '100%',
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
        backgroundColor: COLORS.white,
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
