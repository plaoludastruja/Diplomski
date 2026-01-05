import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './en'
import { sr } from './sr'
import * as SecureStore from 'expo-secure-store'

export const languageResources = {
    EN: { translation: en },
    SR: { translation: sr },
}

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: SecureStore.getItem('currentLanguage') || 'en',
    fallbackLng: 'en',
    resources: languageResources,
})

export default i18n