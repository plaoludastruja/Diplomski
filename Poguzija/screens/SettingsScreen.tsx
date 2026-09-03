import { useCallback, useContext, useEffect, useState } from "react"
import { Pressable, RefreshControl, StyleSheet, Text, View } from "react-native"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native-gesture-handler"
import * as SecureStore from 'expo-secure-store'
import i18next from "i18next"
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"
import { BackgroundSafeAreaView } from "../components/BackgroundSafeAreaView"
import { COLORS, SIZES, THEMES } from "../constants/Colors"
import { languageResources } from "../locales/_i18n"
import { TranslationKeys } from "../locales/_translationKeys"

export default function SettingsScreen() {
    const [selectedLanguage, setSelectedLanguage] = useState('EN')
    const [selectedTheme, setSelectedTheme] = useState('DARK_THEME')
    const { t } = useTranslation()

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        const lang = await SecureStore.getItemAsync('currentLanguage')
        const theme = await SecureStore.getItemAsync('currentTheme')

        if (lang) setSelectedLanguage(lang)
        if (theme) setSelectedTheme(theme)
    }

    const handleSelectedLanguage = useCallback(async (newLangugage: string) => {
        setSelectedLanguage(newLangugage)
        await i18next.changeLanguage(newLangugage)
        SecureStore.setItemAsync('currentLanguage', newLangugage)
    }, [])

    const handleSelectedTheme = useCallback(async (newTheme: string) => {
        setSelectedTheme(newTheme)
        await SecureStore.setItemAsync('currentTheme', newTheme)
    }, [])

    return (
        <BackgroundSafeAreaView>
            <Text style={styles.subtitleText}>{t(TranslationKeys.Settings.SETTINGS)}</Text>
            <View style={styles.line} />
            <ScrollView style={styles.flex} horizontal={false} showsVerticalScrollIndicator={false}>
                <SettingsItems title={t(TranslationKeys.Settings.SELECT_LANGUAGE)} resource={languageResources} selectedSetting={selectedLanguage} onSelectedSetting={(key: string) => handleSelectedLanguage(key)} />
                <SettingsItems title={t(TranslationKeys.Settings.SELECT_THEME)} resource={THEMES} selectedSetting={selectedTheme} onSelectedSetting={(key: string) => handleSelectedTheme(key)} />
            </ScrollView>
        </BackgroundSafeAreaView>
    )
}

interface SettingsItemsProps {
    title: string
    resource: Record<string, unknown>
    selectedSetting: string
    onSelectedSetting: (key: string) => void
}

function SettingsItems({ title, resource, selectedSetting, onSelectedSetting }: SettingsItemsProps) {
    return (
        <>
            <Text style={styles.subtitleText}>{title}:</Text>
            <SettingsItem resource={resource} selectedSetting={selectedSetting} onSelectedSetting={onSelectedSetting} />
        </>

    )
}

interface SettingsItemProps {
    resource: Record<string, unknown>
    selectedSetting: string
    onSelectedSetting: (key: string) => void
}

function SettingsItem({ resource, selectedSetting, onSelectedSetting }: SettingsItemProps) {
    const { t } = useTranslation()
    return (
        Object.keys(resource).map((key, index) => (
            <Pressable key={key} style={styles.settingsItem} onPress={() => onSelectedSetting(key)}>
                <Text style={[styles.textInput, { width: "auto" }]}>{t(TranslationKeys.Settings[key as keyof typeof TranslationKeys.Settings] || key)}</Text>
                {selectedSetting === key && <FontAwesome name="check" style={styles.icon} />}
            </Pressable>
        ))
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '95%',
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
    settingsItem: {
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
        fontSize: SIZES.extraLarge,
    },
})
