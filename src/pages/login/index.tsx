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
import { Permission } from 'src/@core/utils/permission-checker'
import { IMerchant, TenantUser } from 'src/context/types'
import { ErrorResponse } from 'src/@core/types/response'
import { storage } from 'src/@core/utils/storage'
import { authService } from 'src/services/authService'
import { LoginResponse } from 'src/@core/types/auth'

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
  phone: '',
  password: '',
  company_schema: ''
}

interface FormData {
  phone: string
  password: string
  company_schema: string
}

interface Response {
  message: string
  data: {
    employee: TenantUser
    merchant: IMerchant
    token: string
    type: string
    permissions: Permission[]
  }
  errors?: Record<keyof FormData, string[]>
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
      const res: LoginResponse = await authService.employeeLogin({
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
      } else if (res.success && res.data) {
        auth.setUser(res.data.employee || res.data.user)
        auth.setPermissions(res.data.permissions)
        storage.setItem(STORAGE_KEYS.token, res.data.token)
        storage.setJSON(STORAGE_KEYS.permissions, res.data.permissions)
        storage.setItem(STORAGE_KEYS.user_type, res.data.type || 'tenant')
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

        if (err.status === 404) {
          setError('company_schema', {
            type: 'manual',
            message: error.error
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
            backgroundColor: '#7367F03D'
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
              {/* Phone */}
              {/* <Box sx={{ mb: 6 }}>
                <Controller
                  name='phone1'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label={t.login['no-phone']}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='admin@vuexy.com'
                      error={Boolean(errors.phone1)}
                      {...(errors.phone1 && { helperText: errors.phone1.message })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <div
                              style={{
                                fontSize: 14,
                                pointerEvents: 'none',
                                lineHeight: '44px',
                                height: '44px',
                                color: '#000'
                              }}
                            >
                              +998
                            </div>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box> */}

              {/* Tenant (company_schema) */}
              <Box sx={{ mb: 6 }}>
                <Controller
                  name='company_schema'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label={t.login['no-subdomain']}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='techstore'
                      error={Boolean(errors.company_schema)}
                      {...(errors.company_schema && { helperText: errors.company_schema.message })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <div
                              style={{
                                fontSize: 14,
                                pointerEvents: 'none',
                                lineHeight: '44px',
                                height: '44px',
                                color: '#000'
                              }}
                            >
                              .nasiya365.uz
                            </div>
                          </InputAdornment>
                        )
                      }}
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
