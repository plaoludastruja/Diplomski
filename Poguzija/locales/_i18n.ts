import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './en'
import { sr } from './sr'
import * as SecureStore from 'expo-secure-store'
import * as Localization from 'expo-localization'

export const languageResources = {
    EN: { translation: en },
    SR: { translation: sr },
}

const SR_LANGUAGE_CODES = ['sr', 'bs', 'hr', 'cnr']

function GetInitialLanguage(): string {
    const storedLanguage = SecureStore.getItem('currentLanguage')
    if (storedLanguage) return storedLanguage
    const deviceLanguageCode = Localization.getLocales()[0]?.languageCode
    return deviceLanguageCode && SR_LANGUAGE_CODES.includes(deviceLanguageCode) ? 'SR' : 'EN'
}

i18n.use(initReactI18next).init({
    lng: GetInitialLanguage(),
    fallbackLng: 'EN',
    resources: languageResources,
})

export default i18n
