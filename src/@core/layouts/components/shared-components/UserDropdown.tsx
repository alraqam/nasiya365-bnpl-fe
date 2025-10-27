// ** React Imports
import { useState, SyntheticEvent, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'
import { Button, Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { STORAGE_KEYS } from 'src/@core/utils/constants'
import { usePermissions } from 'src/hooks/usePermissions'
import useModal from 'src/@core/store/modal'
import { useLang } from 'src/providers/LanguageProvider'
import CustomTextField from 'src/@core/components/mui/text-field'
import { api } from 'src/configs/api'
import { useAuth } from 'src/hooks/useAuth'
import { storage } from 'src/@core/utils/storage'
import toast from 'react-hot-toast'

interface Props {
  settings: Settings
}

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const MenuItemStyled = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main
  }
}))

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',

  [theme.breakpoints.up('sm')]: {
    width: '480px'
  }
}))

const styles = {
  px: 4,
  py: 1.75,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  color: 'text.primary',
  textDecoration: 'none',
  '& svg': {
    mr: 2.5,
    fontSize: '1.5rem',
    color: 'text.secondary'
  }
}

const UserDropdown = (props: Props) => {
  // ** Props
  const { settings } = props
  const { direction } = settings

  const router = useRouter()
  const { hasPermission } = usePermissions()
  const { user } = useAuth()
  const { setModal, modal, clearModal } = useModal()
  const { t } = useLang()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)

  const handleClose = () => {
    clearModal()
    setOldPassword('')
    setNewPassword('')
  }

  const handleChangeProfile = async () => {
    try {
      await api('/api/profile/update', {
        method: 'PUT',
        body: JSON.stringify({
          current_password: oldPassword,
          password: newPassword
        })
      })
      toast.success(t['profile-updated'] || 'Profile updated successfully')
      clearModal()
      setOldPassword('')
      setNewPassword('')
    } catch (error) {
      // Error is already handled by API client
    }
  }

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    storage.removeItem(STORAGE_KEYS.token)
    storage.removeItem(STORAGE_KEYS.permissions)
    storage.removeItem(STORAGE_KEYS.user_type)
    storage.removeItem(STORAGE_KEYS.tenant_id)
    handleDropdownClose()
    router.reload()
  }

  return (
    <Fragment>
      <Button
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0px',
          borderRadius: '999px',
          width: 38,
          height: 38
        }}
        onClick={handleDropdownOpen}
      >
        <Badge
          overlap='circular'
          onClick={handleDropdownOpen}
          sx={{ cursor: 'pointer' }}
          badgeContent={<BadgeContentSpan />}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <Avatar
            alt='John Doe'
            src='/images/avatars/1.png'
            onClick={handleDropdownOpen}
            sx={{ width: 38, height: 38 }}
          />
        </Badge>
        {/* <Typography
          sx={theme => ({ color: '#000', [theme.breakpoints.down('sm')]: { display: 'none' } })}
          variant='button'
        >
          {user?.name}
        </Typography> */}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.75 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ py: 1.75, px: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500 }}>{user?.name}</Typography>
              <Typography variant='body2'>{user?.role?.name || 'Admin'}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />

        {hasPermission('put_update', 'ProfileController') && [
          <MenuItemStyled
            sx={{ p: 0 }}
            onClick={() => {
              setModal('edit-profile')
            }}
            key='profile'
          >
            <Box sx={styles}>
              <Icon icon='tabler:user-check' />
              {t['my-profile']}
            </Box>
          </MenuItemStyled>,
          <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} key='divider' />
        ]}
        <MenuItemStyled sx={{ p: 0 }} onClick={handleLogout}>
          <Box sx={styles}>
            <Icon icon='tabler:logout' />
            {t.logout}
          </Box>
        </MenuItemStyled>
      </Menu>

      <Dialog open={modal === 'edit-profile'} onClose={() => setModal('')}>
        <DialogTitle>
          <Typography variant='h4' align='center'>
            {t.forms['profile-update'].dialog['search-title']}
          </Typography>
          <Typography variant='body2' align='center'>
            {t.forms['profile-update'].dialog['search-desc']}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Form>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms['profile-update'].password}</Typography>
              <CustomTextField
                fullWidth
                placeholder={t.forms['profile-update'].placeholder.password}
                name='oldPassword'
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms['profile-update']['new-password']}</Typography>
              <CustomTextField
                fullWidth
                placeholder={t.forms['profile-update'].placeholder['new-password']}
                name='newPassword'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </Box>

            <Box display='flex' justifyContent='center' gap={4}>
              <Button variant='outlined' type='button' onClick={handleClose}>
                {t.close}
              </Button>
              <Button variant='contained' onClick={handleChangeProfile}>
                {t.search}
              </Button>
            </Box>
          </Form>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}

export default UserDropdown
