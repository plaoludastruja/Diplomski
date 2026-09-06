import { useCallback, useContext, useEffect, useState } from "react"
import { Animated, Pressable, RefreshControl, StyleSheet, Text, View, useAnimatedValue } from "react-native"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native-gesture-handler"
import * as SecureStore from 'expo-secure-store'
import i18next from "i18next"
import { FontAwesome, MaterialIcons } from "@expo/vector-icons"
import { BackgroundSafeAreaView } from "../components/Common/BackgroundSafeAreaView"
import { Divider } from "../components/Common/Divider"
import { SubtitleText } from "../components/Common/SubtitleText"
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
            <SubtitleText>{t(TranslationKeys.Settings.SETTINGS)}</SubtitleText>
            <Divider />
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
            <SubtitleText>{title}:</SubtitleText>
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
        Object.keys(resource).map((key) => (
            <SettingsOptionRow
                key={key}
                label={t(TranslationKeys.Settings[key as keyof typeof TranslationKeys.Settings] || key)}
                selected={selectedSetting === key}
                onPress={() => onSelectedSetting(key)} />
        ))
    )
}

interface SettingsOptionRowProps {
    label: string
    selected: boolean
    onPress: () => void
}

function SettingsOptionRow({ label, selected, onPress }: SettingsOptionRowProps) {
    const scaleAnim = useAnimatedValue(1)

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start()
    }

    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()
    }

    return (
        <Animated.View style={[styles.settingsItem, { transform: [{ scale: scaleAnim }] }]}>
            <Pressable style={styles.settingsItemPressable} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <Text style={[styles.textInput, { width: "auto" }]}>{label}</Text>
                {selected && <FontAwesome name="check" style={styles.icon} />}
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '95%',
    },
    settingsItem: {
        height: 60,
        backgroundColor: COLORS.dark,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    settingsItemPressable: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
