import { Keyboard, StyleSheet, View, Pressable, TextInput, ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import { Ingredient } from '../../model/model'
import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../../constants/Colors'
import { GroupHeaderChip } from '../Common/GroupHeaderChip'
import { ModalBackdrop } from '../Common/ModalBackdrop'
import { PillButton } from '../Common/PillButton'
import { TranslationKeys } from '../../locales/_translationKeys'
import { useTranslation } from 'react-i18next'
import { SelectIngredientOrUnitList } from './SelectIngredientOrUnitList'

interface AddIngredientsModalProps {
    visible: boolean
    dataEdit: Ingredient | undefined
    presetName?: string
    groups?: string[]
    onAdd: (ingredient: Ingredient) => void
    onClose: () => void
}

export const AddIngredientsModal = ({ visible, dataEdit, presetName, groups, onAdd, onClose }: AddIngredientsModalProps) => {
    const { t } = useTranslation()
    const [modalVisible, setModalVisible] = useState(false)
    const [modalDataType, setModalDataType] = useState('')

    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [unit, setUnit] = useState('')
    const [group, setGroup] = useState<string | undefined>(undefined)

    const openModal = (dataType: 'ingredient' | 'unit') => {
        setModalDataType(dataType)
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalDataType('')
        setModalVisible(false)
    }

    useEffect(() => {
        setName(dataEdit?.name ?? presetName ?? '')
        setAmount(dataEdit?.amount ?? '')
        setUnit(dataEdit?.unit ?? '')
        setGroup(dataEdit?.group)
    }, [dataEdit, presetName])

    const handleOnClose = () => {
        Keyboard.dismiss()
        onClose()
    }

    const handleOnAdd = () => {
        const ingredient: Ingredient = {
            name: name,
            amount: amount,
            unit: unit,
            ...(group && { group })
        }
        Keyboard.dismiss()
        onAdd(ingredient)
        setName('')
        setAmount('')
        setUnit('')
        setGroup(undefined)
        onClose()
    }

    return (
        <>
            <ModalBackdrop visible={visible} onClose={handleOnClose} cardStyle={styles.card}>
                <Pressable style={styles.nameInput} onPress={() => { if (!dataEdit?.name) openModal('ingredient') }}>
                    <MaterialIcons name="search" style={styles.icon} />
                    <TextInput value={t(TranslationKeys.IngredientItem[name as keyof typeof TranslationKeys.IngredientItem]) || name} placeholder={t(TranslationKeys.Ingredient.NAME)} placeholderTextColor={COLORS.lightDark} editable={false} style={styles.textInput} />
                </Pressable>
                <View style={styles.amountAndUnitContainer}>
                    <View style={[styles.amountAndUnitInput, styles.amountInput]}>
                        <TextInput value={amount} placeholder={t(TranslationKeys.Ingredient.AMOUNT)} placeholderTextColor={COLORS.lightDark} style={styles.textInput} keyboardType='numeric' onChangeText={text => setAmount(text)} />
                    </View>
                    <Pressable style={[styles.amountAndUnitInput, styles.unitInput]} onPress={() => openModal('unit')}>
                        <TextInput value={t(TranslationKeys.UnitItem[unit as keyof typeof TranslationKeys.UnitItem]) || unit} placeholder={t(TranslationKeys.Ingredient.UNIT)} placeholderTextColor={COLORS.lightDark} editable={false} style={styles.textInput} onChangeText={text => setUnit(text)} />
                    </Pressable>
                </View>
                {groups && groups.length > 0 &&
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="always" style={styles.groupScroll} contentContainerStyle={styles.groupContainer}>
                        <GroupHeaderChip label={t(TranslationKeys.Ingredient.NO_GROUP)} selected={!group} onPress={() => setGroup(undefined)} inline />
                        {groups.map((sectionName) => (
                            <GroupHeaderChip key={sectionName} label={sectionName} selected={group === sectionName} onPress={() => setGroup(sectionName)} inline />
                        ))}
                    </ScrollView>}
                <PillButton onPress={handleOnAdd} style={styles.addButton}>{t(dataEdit ? TranslationKeys.Button.EDIT : TranslationKeys.Button.ADD)}</PillButton>
            </ModalBackdrop>

            <SelectIngredientOrUnitList
                modalDataType={modalDataType}
                visible={modalVisible}
                onAdd={(item: { name: string }) => { if (modalDataType === 'ingredient') { setName(item.name) } else if (modalDataType === 'unit') { setUnit(item.name) } }}
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
    groupScroll: {
        width: '95%',
        marginBottom: SIZES.small,
    },
    groupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
