import { StyleSheet, View, Pressable, TextInput } from 'react-native'
import { useEffect, useState } from 'react'
import { Ingredient } from '../../model/model'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../../constants/Colors'
import { ModalBackdrop } from '../Common/ModalBackdrop'
import { PillButton } from '../Common/PillButton'
import { TranslationKeys } from '../../locales/_translationKeys'
import { useTranslation } from 'react-i18next'
import { SelectIngredientOrUnitList } from './SelectIngredientOrUnitList'

interface AddIngredientsModalProps {
    visible: boolean
    dataEdit: Ingredient | undefined
    onAdd: (ingredient: Ingredient) => void
    onClose: () => void
}

export const AddIngredientsModal = ({ visible, dataEdit, onAdd, onClose }: AddIngredientsModalProps) => {
    const {t} = useTranslation()
    const [modalVisible, setModalVisible] = useState(false)
    const [modalDataType, setModalDataType] = useState('')

    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [unit, setUnit] = useState('')

    const openModal = (dataType: 'ingredient' | 'unit') => {
        setModalDataType(dataType)
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalDataType('')
        setModalVisible(false)
    }

    useEffect(() => {
        setName(dataEdit?.name ?? '')
        setAmount(dataEdit?.amount ?? '')
        setUnit(dataEdit?.unit ?? '')
    },[dataEdit])

    const handleOnClose = () => {
        onClose()
    }

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
        <>
            <ModalBackdrop visible={visible} onClose={handleOnClose} cardStyle={styles.card}>
                <Pressable style={styles.nameInput} onPress={() => {if(!dataEdit?.name) openModal('ingredient')}}>
                    <MaterialIcons name="search" style={styles.icon} />
                    <TextInput value={t(TranslationKeys.IngredientItem[name as keyof typeof TranslationKeys.IngredientItem]) || name} placeholder={t(TranslationKeys.Ingredient.NAME)} editable={false} style={styles.textInput} />
                </Pressable>
                <View style={styles.amountAndUnitContainer}>
                    <View style={[styles.amountAndUnitInput, styles.amountInput]}>
                        <TextInput value={amount} placeholder={t(TranslationKeys.Ingredient.AMOUNT)} style={styles.textInput} keyboardType='numeric' onChangeText={text => setAmount(text)} />
                    </View>
                    <Pressable style={[styles.amountAndUnitInput, styles.unitInput]} onPress={() => openModal('unit')}>
                        <TextInput value={t(TranslationKeys.UnitItem[unit as keyof typeof TranslationKeys.UnitItem]) || unit} placeholder={t(TranslationKeys.Ingredient.UNIT)} editable={false} style={styles.textInput} onChangeText={text => setUnit(text)} />
                    </Pressable>
                </View>
                <PillButton onPress={ handleOnAdd } style={styles.addButton}>{t(dataEdit ? TranslationKeys.Button.EDIT : TranslationKeys.Button.ADD)}</PillButton>
            </ModalBackdrop>

            <SelectIngredientOrUnitList
                modalDataType={ modalDataType }
                visible={ modalVisible } 
                onAdd={ (item: { name: string }) => { if(modalDataType === 'ingredient'){setName(item.name)} else if(modalDataType === 'unit'){setUnit(item.name)} }}
                onClose={() => closeModal()} />
        </>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingVertical: SIZES.extraLarge,
        backgroundColor: COLORS.dark,
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
        fontSize: SIZES.extraLarge,
    },
    addButton: {
        marginVertical: 0,
        marginTop: SIZES.base,
    },
})
