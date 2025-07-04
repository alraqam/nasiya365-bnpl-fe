// ** React Import
import { ReactNode, useEffect } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import { useRouter } from 'next/router'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
  trigger?: ReactNode
}

const LanguageDropdown = ({ settings, saveSettings, trigger }: Props) => {
  // ** Hook
  const { i18n } = useTranslation()
  const router = useRouter()

  const handleLangItemClick = (lang: 'uz' | 'ru') => {
    i18n.changeLanguage(lang)
    router.push(router.asPath, router.asPath, { locale: lang })
  }

  // ** Change html `lang` attribute when changing locale
  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language)
  }, [i18n.language])

  return (
    <OptionsMenu
      iconButtonProps={{ color: 'inherit' }}
      icon={<Icon fontSize='1.625rem' icon='tabler:language' />}
      customTrigger={trigger}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4.25, minWidth: 130 } } }}
      options={[
        {
          text: "O'zbekcha",
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'uz' || i18n.language === '',
            onClick: () => {
              handleLangItemClick('uz')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        },
        {
          text: 'Русский',
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === 'ru',
            onClick: () => {
              handleLangItemClick('ru')
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        }
      ]}
    />
  )
}

export default LanguageDropdown
