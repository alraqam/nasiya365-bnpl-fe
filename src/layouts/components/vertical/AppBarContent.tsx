// ** MUI Imports
import { Card, Stack, styled, Typography, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { ReactNode, useState } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Icon2 from 'src/@core/components/icon/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'

// ** Components
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import useModal from 'src/@core/store/modal'
import { useRouter } from 'next/router'
import { useLang } from 'src/providers/LanguageProvider'
import NotificationDropdown from './Notification'
import { ThemeColor } from 'src/@core/layouts/types'
import Calculator from './Calculator'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

export type NotificationsType = {
  meta: string
  title: string
  subtitle: string
} & (
  | { avatarAlt: string; avatarImg: string; avatarText?: never; avatarColor?: never; avatarIcon?: never }
  | {
      avatarAlt?: never
      avatarImg?: never
      avatarText: string
      avatarIcon?: never
      avatarColor?: ThemeColor
    }
  | {
      avatarAlt?: never
      avatarImg?: never
      avatarText?: never
      avatarIcon: ReactNode
      avatarColor?: ThemeColor
    }
)

const notifications: NotificationsType[] = [
  {
    meta: 'Today',
    avatarAlt: 'Flora',
    title: 'Congratulation Flora! 🎉',
    avatarImg: '/images/avatars/4.png',
    subtitle: 'Won the monthly best seller badge'
  },
  {
    meta: 'Yesterday',
    avatarColor: 'primary',
    subtitle: '5 hours ago',
    avatarText: 'Robert Austin',
    title: 'New user registered.'
  },
  {
    meta: '11 Aug',
    avatarAlt: 'message',
    title: 'New message received 👋🏻',
    avatarImg: '/images/avatars/5.png',
    subtitle: 'You have 10 unread messages'
  },
  {
    meta: '25 May',
    title: 'Paypal',
    avatarAlt: 'paypal',
    subtitle: 'Received Payment',
    avatarImg: '/images/misc/paypal.png'
  },
  {
    meta: '19 Mar',
    avatarAlt: 'order',
    title: 'Received Order 📦',
    avatarImg: '/images/avatars/3.png',
    subtitle: 'New order received from John'
  },
  {
    meta: '27 Dec',
    avatarAlt: 'chart',
    subtitle: '25 hrs ago',
    avatarImg: '/images/misc/chart.png',
    title: 'Finance report has been generated'
  }
]

const AppBarContent = (props: Props) => {
  const [search, setSearch] = useState('')

  const { setModal } = useModal()
  const { t, lang } = useLang()

  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const theme = useTheme()
  const router = useRouter()
  const pathname = router.pathname

  const handleSearchClick = () => {
    switch (pathname) {
      case '/clients':
        setModal('search-clients')
        break
      case '/orders':
        setModal('search-orders')
        break
      case '/employees':
        setModal('search-employees')
        break
      case '/expenses':
        setModal('search-expenses')
        break
      case '/investment/investors':
        setModal('search-investors')
    }

    if (pathname === '/products' && router.query.type === 'devices') {
      setModal('search-devices')
    } else if (pathname === '/products' && router.query.type === 'accessories') {
      setModal('search-accessories')
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%'
      }}
    >
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon fontSize='1.5rem' icon='tabler:menu-2' />
          </IconButton>
        ) : null}
        <Stack display='flex' direction='row' onClick={handleSearchClick}>
          <Icon2 svg='/icons/search.svg' width={44} height={44}></Icon2>
          <CustomTextField
            sx={{
              '& .MuiInputBase-root': { border: 'none', '&.Mui-focused': { boxShadow: 'none' } },
              '& .MuiInputBase-input': {
                paddingLeft: '4px !important',
                fontSize: '17px'
              },
              display: { md: 'inline-block', xs: 'none' }
            }}
            placeholder={t.search}
            onChange={e => setSearch(e.target.value)}
          />
        </Stack>
        {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <Card
          sx={{
            background: '#80839029',
            paddingY: '6px',
            paddingX: '12px',
            color: '#808390',
            marginRight: '20px'
          }}
        >
          $ 12500
        </Card>
        <Calculator />
        <LanguageDropdown
          settings={settings}
          saveSettings={saveSettings}
          trigger={
            // <Stack direction='row' spacing={2} alignItems='center'>
            //   <StyledImg src={lang === 'uz' ? '/flags/uz.svg' : '/flags/ru.svg'} alt='uzb flag' />
            //   <Box
            //     display='flex'
            //     alignItems='center'
            //     gap='8px'
            //     sx={theme => ({ [theme.breakpoints.down('sm')]: { display: 'none' } })}
            //   >
            //     <Typography variant='button' color='#000'>
            //       {lang === 'uz' ? "O'zbekcha" : 'Русский'}
            //     </Typography>
            //     <Icon2 svg='/icons/chevron-down.svg' width={18} height={18} color='#000' />
            //   </Box>
            // </Stack>
            <IconButton
              sx={{ padding: '0px', borderRadius: '999px !important', '&:hover': { backgroundColor: 'transparent' } }}
            >
              <Icon color='#2F2B3DE5' icon='tabler:language' />
            </IconButton>
          }
        />
        <NotificationDropdown settings={settings} notifications={notifications} />
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
