// ** MUI Imports
import { Stack, styled, Typography, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { width } from '@mui/system'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Icon2 from 'src/@core/components/icon/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

interface Props {
  hidden: boolean
  settings: Settings
  toggleNavVisibility: () => void
  saveSettings: (values: Settings) => void
}

const StyledImg = styled('img')(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: 999,
  [theme.breakpoints.down('sm')]: {
    width: 36,
    height: 36,
    marginTop: '5px'
  }
}))

const AppBarContent = (props: Props) => {
  const [search, setSearch] = useState('')

  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const { i18n } = useTranslation()
  const theme = useTheme()

  const handleSearch = () => {
    console.log(search)
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <Icon fontSize='1.5rem' icon='tabler:menu-2' />
          </IconButton>
        ) : null}
        <Stack display='flex' direction='row'>
          <Icon2 svg='/icons/search.svg' width={44} height={44} onClick={handleSearch}></Icon2>
          <CustomTextField
            sx={{
              '& .MuiInputBase-root': { border: 'none', '&.Mui-focused': { boxShadow: 'none' } },
              '& .MuiInputBase-input': {
                paddingLeft: '4px !important',
                fontSize: '17px'
              }
            }}
            placeholder='Izlash'
            onChange={e => setSearch(e.target.value)}
          />
        </Stack>
        {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <LanguageDropdown
          settings={settings}
          saveSettings={saveSettings}
          trigger={
            <Stack direction='row' spacing={2} alignItems='center'>
              <StyledImg src={i18n.language === 'uz' ? '/flags/uz.svg' : '/flags/ru.svg'} alt='uzb flag' />
              <Box
                display='flex'
                alignItems='center'
                gap='8px'
                sx={theme => ({ [theme.breakpoints.down('sm')]: { display: 'none' } })}
              >
                <Typography variant='button' color='#000'>
                  {i18n.language === 'uz' ? "O'zbekcha" : 'Русский'}
                </Typography>
                <Icon2 svg='/icons/chevron-down.svg' width={18} height={18} color='#000' />
              </Box>
            </Stack>
          }
        />
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
