import { useContext, useEffect, useState } from "react"
import {  FlatList, Pressable, RefreshControl,  StyleSheet, Text, View } from "react-native"
import BackgroundSafeAreaView from "../../components/BackgroundSafeAreaView"
import { SIZES, COLORS } from "../../constants/Colors"
import { TranslationKeys } from "../../locales/_translationKeys"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native-gesture-handler"
import * as SecureStore from 'expo-secure-store'
import i18next from "i18next"
import { languageResources } from "../../locales/_i18n"
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"

export default function SettingsScreen() {
    const [selectedLanguage, setSelectedLanguage] = useState(SecureStore.getItem('currentLanguage') || 'en')
    const [selectedTheme, setSelectedTheme] = useState(SecureStore.getItem('currentTheme') || 'DARK_THEME')
    const {t} = useTranslation()

    const handleSelectedLanguage = (newLangugage: string) => {
        setSelectedLanguage(newLangugage)
        i18next.changeLanguage(newLangugage)
        SecureStore.setItem('currentLanguage', newLangugage)
    }

    const handleSelectedTheme = (newTheme: string) => {
        setSelectedTheme(newTheme)
        SecureStore.setItem('currentTheme', newTheme)
    }

    return (
        <BackgroundSafeAreaView>
            <Text style={styles.subtitleText}>{t(TranslationKeys.Settings.SETTINGS)}</Text>
            <View style={styles.line} />
            <ScrollView style={styles.flex} horizontal={false} showsVerticalScrollIndicator={false}>
                <Text style={styles.subtitleText}>{t(TranslationKeys.Settings.SELECT_LANGUAGE)}:</Text>
                { Object.keys(languageResources).map((languageKey, index) => (
                    <Pressable key={index} style={styles.ingredientItem} onPress={() => handleSelectedLanguage(languageKey)}>
                        <Text style={[styles.textInput, { width: "auto" }]}>{t(TranslationKeys.Settings[languageKey])}</Text>
                        {selectedLanguage === languageKey && <FontAwesome name="check" style={styles.icon} />}
                    </Pressable>
                ))}
                <Text style={styles.subtitleText}>{t(TranslationKeys.Settings.SELECT_THEME)}:</Text>
                <Pressable style={styles.ingredientItem} onPress={() => handleSelectedTheme('DARK_THEME')}>
                    <Text style={[styles.textInput, { width: "auto" }]}>{t(TranslationKeys.Settings.DARK_THEME)}</Text>
                    {selectedTheme === 'DARK_THEME' && <FontAwesome name="check" style={styles.icon} />}
                </Pressable>
                <Pressable style={styles.ingredientItem} onPress={() => handleSelectedTheme('LIGHT_THEME')}>
                    <Text style={[styles.textInput, { width: "auto" }]}>{t(TranslationKeys.Settings.LIGHT_THEME)}</Text>
                    {selectedTheme === 'LIGHT_THEME' && <FontAwesome name="check" style={styles.icon} />}
                </Pressable>
            </ScrollView>
        </BackgroundSafeAreaView>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '95%'
    },
    line: {
        backgroundColor: COLORS.tint,
        height: SIZES.base,
        width: '95%',
        borderRadius: SIZES.base,
        elevation: 2,
    },
    subtitleText: {
        width: '95%',
        color: COLORS.tint,
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        padding: SIZES.base,
        elevation: 2,
    },
    selectContainer: {
        
    },
    itemContainer: {
        flexDirection: 'row'
    },
    ingredientItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        backgroundColor: COLORS.dark,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    textInput: {
        width: '100%',
        marginLeft: 10,
        color: COLORS.white,
        fontSize: SIZES.large,
    },
    icon: {
        marginRight: 10,
        color: COLORS.white,
        fontSize: SIZES.extraLarge
    },
})