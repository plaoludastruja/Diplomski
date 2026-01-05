import { Link, Stack } from 'expo-router'
import { StyleSheet } from 'react-native'

import { Text, View } from '../components/Themed'
import BackgroundSafeAreaView from '../components/BackgroundSafeAreaView'
import { COLORS, SIZES } from '../constants/Colors'
import { useTranslation } from 'react-i18next'
import { TranslationKeys } from '../locales/_translationKeys'

export default function NotFoundScreen() {
    const {t} = useTranslation()
    return (
        <BackgroundSafeAreaView>
            <Stack.Screen options={{ title: 'Oops!' }} />
                <Text style={styles.text}>{t(TranslationKeys.Missing.Text)}</Text>
                <Link href="/">
                    <Text style={styles.linkText}>{t(TranslationKeys.Missing.Link)}</Text>
                </Link>
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    text: {
        fontSize: SIZES.extraLarge,
        color: COLORS.tint,
    },
    linkText: {
        fontSize: SIZES.extraLarge,
        color: COLORS.dark,
    },
})
