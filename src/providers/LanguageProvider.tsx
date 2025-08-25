import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { STORAGE_KEYS } from 'src/@core/utils/constants'
import uz from 'src/locales/uz.json'
import ru from 'src/locales/ru.json'

export const LANGS = ['uz', 'ru'] as const

export type AppLang = (typeof LANGS)[number]

interface LanguageProviderProps {
  lang: AppLang
  changeLang: (lang: AppLang) => void
  t: typeof uz | typeof ru
  // t: typeof uz
}
interface Props {
  children: ReactNode
}

const LanguageContext = createContext<LanguageProviderProps | null>(null)

const translations = { uz, ru }
// const translations = { uz }

export const LanguageProvider = ({ children }: Props) => {
  const [lang, setLang] = useState<AppLang>('uz')
  const [t, setT] = useState<typeof uz | typeof ru>(translations[lang])
  // const [t, setT] = useState<typeof uz>(uz)

  const changeLang = (newLang: AppLang) => {
    if (newLang !== lang) {
      setLang(newLang)
      localStorage.setItem(STORAGE_KEYS.lang, newLang)
    }
  }

  useEffect(() => {
    setLang(localStorage.getItem(STORAGE_KEYS.lang) as AppLang)
  }, [lang])

  useEffect(() => {
    setT(translations[lang])
  }, [lang])

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEYS.lang)) {
      localStorage.setItem(STORAGE_KEYS.lang, lang)
    }
  }, [lang])

  return <LanguageContext.Provider value={{ lang, changeLang, t }}>{children}</LanguageContext.Provider>
}

export const useLang = () => {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLang must be used within a LanguageProvider')
  }

  return context
}
