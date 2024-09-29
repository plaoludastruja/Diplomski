import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './en'
import { sr } from './sr'

export const languageResources = {
    en: { translation: en },
    sr: { translation: sr },
}

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources: languageResources,
})

export default i18n