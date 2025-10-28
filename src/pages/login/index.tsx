// ** React Imports
import { useState, ReactNode } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useLang } from 'src/providers/LanguageProvider'
import { api } from 'src/configs/api'
import toast from 'react-hot-toast'
import { STORAGE_KEYS } from 'src/@core/utils/constants'
import { useRouter } from 'next/router'
import { convertToPermissionGroups } from 'src/@core/utils/permission-checker'
import { ErrorResponse } from 'src/@core/types/response'
import { storage } from 'src/@core/utils/storage'
import { authService } from 'src/services/authService'
import { EmployeeLoginResponse } from 'src/@core/types/auth'
import useHomeRoute from 'src/layouts/components/acl/useHomeRoute'

// ** Styled Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const defaultValues: FormData = {
  phone: '+998901000001',
  password: 'admin123',
  company_schema: 'demo'
}

interface FormData {
  phone: string
  password: string
  company_schema: string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const { t } = useLang()
  const router = useRouter()

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const homeRoute = useHomeRoute()

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur'
  })

  const onSubmit = async (data: FormData) => {
    const { phone, password, company_schema } = data

    try {
      const res = await authService.employeeLogin({
        phone,
        password,
        company_schema
      })

      if ('success' in res && !res.success) {
        if (!res.errors) {
          toast.error(t['login-error'] || 'Something went wrong')
          return
        }

        if (res.errors) {
          Object.entries(data).forEach(([key, value]) => {
            if (!value.length) {
              setError(key as keyof FormData, {
                type: 'manual',
                message: t['required-fields'] || 'Required fields'
              })
            }
          })

          Object.entries(res.errors).forEach(([key, value]) => {
            value.forEach((msg: string) => {
              setError(key as keyof FormData, {
                type: 'manual',
                message: msg
              })
            })
          })
        }
      } else if (res.status && res.data) {
        auth.setUser(res.data.employee)
        const permissionGroups = convertToPermissionGroups(res.data.employee.permissions)
        storage.setJSON(STORAGE_KEYS.permissions, permissionGroups)
        auth.setPermissions(permissionGroups)
        storage.setItem(STORAGE_KEYS.token, res.data.token)
        storage.setItem(STORAGE_KEYS.user_type, 'tenant')
        // Store tenant ID from login form for API requests
        storage.setItem(STORAGE_KEYS.tenant_id, company_schema)
        router.push('/dashboard')
      }
    } catch (error: any) {
      const err = error as ErrorResponse<FormData>

      if (err.errors) {
        Object.entries(err.errors).forEach(([key, value]) => {
          value.forEach((msg: string) => {
            setError(key as keyof FormData, {
              type: 'manual',
              message: msg
            })
          })
        })
      }

      if (typeof err.status === 'number') {
        if (err.status === 401) {
          setError('phone', {
            type: 'manual',
            message: error.message
          })
          setError('password', {
            type: 'manual',
            message: error.message
          })
        }
      }
    }
  }

  const imageSource = 'login-illustrator'

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        flexDirection: 'row-reverse',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100vh'
      }}
    >
      {!hidden ? (
        <Box
          sx={{
            width: '50%',
            height: '100%',
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: '#0553F13D'
          }}
        >
          <LoginIllustration alt='login-illustration' src={`/images/pages/${imageSource}.svg`} />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                {t.welcome}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{t['welcome-description']}</Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              {/* Company Schema */}
              <Box sx={{ mb: 6 }}>
                <Controller
                  name='company_schema'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label='Company Subdomain'
                      onChange={onChange}
                      id='auth-login-v2-subdomain'
                      error={Boolean(errors.company_schema)}
                      {...(errors.company_schema && { helperText: errors.company_schema.message })}
                      type='text'
                    />
                  )}
                />
              </Box>
              {/* Phone */}
              <Box sx={{ mb: 6 }}>
                <Controller
                  name='phone'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label={t.login['no-phone'] || 'Phone'}
                      onChange={onChange}
                      id='auth-login-v2-phone'
                      error={Boolean(errors.phone)}
                      {...(errors.phone && { helperText: errors.phone.message })}
                      type='tel'
                    />
                  )}
                />
              </Box>
              {/* Password */}
              <Box sx={{ mb: 1.5 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label={t.login.password}
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      {...(errors.password && { helperText: errors.password.message })}
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              <Button fullWidth type='submit' variant='contained' sx={{ mt: 6 }}>
                {t.login.submit}
              </Button>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
