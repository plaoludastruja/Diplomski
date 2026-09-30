import { Keyboard, StyleSheet, TextInput } from 'react-native'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { COLORS, SIZES } from '../../constants/Colors'
import { TranslationKeys } from '../../locales/_translationKeys'
import { ModalBackdrop } from '../Common/ModalBackdrop'
import { PillButton } from '../Common/PillButton'

interface AddSectionModalProps {
    visible: boolean
    dataEdit?: string
    onSave: (section: string) => void
    onClose: () => void
}

export const AddSectionModal = ({ visible, dataEdit, onSave, onClose }: AddSectionModalProps) => {
    const { t } = useTranslation()
    const [sectionName, setSectionName] = useState(dataEdit ?? '')
    const inputRef = useRef<TextInput>(null)

    const handleOnClose = () => {
        inputRef.current?.blur()
        Keyboard.dismiss()
        setSectionName('')
        onClose()
    }

    const handleOnSave = () => {
        const trimmedSection = sectionName.trim()
        if (trimmedSection === '') return
        inputRef.current?.blur()
        Keyboard.dismiss()
        onSave(trimmedSection)
        setSectionName('')
        onClose()
    }

    const handleOnShow = () => {
        setTimeout(() => inputRef.current?.focus(), 150)
    }

    return (
        <ModalBackdrop visible={visible} onClose={handleOnClose} onShow={handleOnShow} cardStyle={styles.card}>
            <TextInput
                ref={inputRef}
                value={sectionName}
                placeholder={t(TranslationKeys.Recipe.SECTION_NAME_PLACEHOLDER)}
                placeholderTextColor={COLORS.lightDark}
                style={styles.textInput}
                autoComplete='off'
                onChangeText={setSectionName}
                onSubmitEditing={handleOnSave}
            />
            <PillButton onPress={handleOnSave} style={styles.addButton}>{t(dataEdit ? TranslationKeys.Button.EDIT : TranslationKeys.Recipe.ADD_SECTION)}</PillButton>
        </ModalBackdrop>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingVertical: SIZES.extraLarge,
        backgroundColor: COLORS.dark,
    },
    textInput: {
        width: '95%',
        height: 60,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.extraLarge,
        paddingHorizontal: SIZES.large,
        color: COLORS.tint,
        fontSize: SIZES.large,
        marginBottom: SIZES.small,
    },
    addButton: {
        marginVertical: 0,
        marginTop: SIZES.base,
    },
})
