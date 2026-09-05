import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { PillButton } from '../Common/PillButton'
import { TranslationKeys } from '../../locales/_translationKeys'

export const RecipeSuggestions = () => {
    const { t } = useTranslation()

    return (
        <View style={styles.container}>
            <PillButton>{t(TranslationKeys.Fridge.SUGGEST_RECIPE)}</PillButton>
            <PillButton>{t(TranslationKeys.Fridge.RANDOM_RECIPE)}</PillButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '95%',
        alignItems: 'center',
    },
})
