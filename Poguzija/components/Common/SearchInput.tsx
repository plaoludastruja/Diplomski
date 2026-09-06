import { Pressable, StyleSheet, TextInput } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { COLORS, SIZES } from '../../constants/Colors'
import { TranslationKeys } from '../../locales/_translationKeys'

interface SearchInputProps {
    value: string
    onChangeText: (text: string) => void
}

export const SearchInput = ({ value, onChangeText }: SearchInputProps) => {
    const { t } = useTranslation()

    return (
        <Pressable style={styles.inputContainer}>
            <MaterialIcons name="search" style={styles.icon} />
            <TextInput
                style={styles.textInput}
                placeholder={t(TranslationKeys.Button.SEARCH)}
                value={value}
                autoComplete='off'
                onChangeText={onChangeText}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        height: 60,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.base,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
        elevation: 2,
        shadowColor: COLORS.dark,
    },
    textInput: {
        width: '100%',
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    icon: {
        marginHorizontal: SIZES.base,
        color: COLORS.lightDark,
        fontSize: SIZES.extraLarge,
    },
})
