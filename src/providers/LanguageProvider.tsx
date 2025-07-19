import { createContext, ReactNode, use, useContext, useEffect, useState } from 'react'
import uz from 'src/locales/uz.json'
// import ru from 'src/locales/ru.json'

export const LANGS = ['uz', 'ru'] as const

export type AppLang = (typeof LANGS)[number]

interface LanguageProviderProps {
  lang: AppLang
  changeLang: (lang: AppLang) => void
  // t: typeof uz | typeof ru
  t: typeof uz
}
interface Props {
  children: ReactNode
}

const LanguageContext = createContext<LanguageProviderProps | null>(null)

// const translations = { uz, ru }
const translations = { uz }

export const LanguageProvider = ({ children }: Props) => {
  const [lang, setLang] = useState<AppLang>(() => {
    const currentLang = (localStorage.getItem('nasiya-lang') as AppLang) || 'uz'
    return currentLang
  })
  // const [t, setT] = useState<typeof uz | typeof ru>(() => {
  //   const currentLang = (localStorage.getItem('nasiya-lang') as AppLang) || 'uz'
  //   return translations[currentLang]
  // })
  const [t, setT] = useState<typeof uz>(uz)

  const changeLang = (newLang: AppLang) => {
    if (newLang !== lang) {
      setLang(newLang)
      localStorage.setItem('nasiya-lang', newLang)
    }
  }

  // useEffect(() => {
  //   setT(translations[lang])
  // }, [lang])

  useEffect(() => {
    if (!localStorage.getItem('nasiya-lang')) {
      localStorage.setItem('nasiya-lang', lang)
    }
  }, [])

  return <LanguageContext.Provider value={{ lang, changeLang, t }}>{children}</LanguageContext.Provider>
}

export const useLang = () => {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLang must be used within a LanguageProvider')
  }

  return context
}
