import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // lng: 'uz',
    backend: {
      loadPath: '/locales/{{lng}}.json'
    },
    fallbackLng: 'uz',
    debug: false,
    keySeparator: '.',
    react: {
      useSuspense: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    }
  })

export default i18n
