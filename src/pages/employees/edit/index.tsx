import { Box, Button, Card, Grid, InputAdornment, MenuItem, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useLang } from 'src/providers/LanguageProvider'
import DatePicker from 'react-datepicker'
import InputMask from 'react-input-mask'
import { useRouter } from 'next/router'

interface FormState {
  phone1: string
  phone2: string
  email: string
  familyStatus: string
  numberOfChildren: string
  password: string
  confirmPassword: string
  surname: string
  name: string
  patronymic: string
  passportSeries: string
  passportIssuer: string
  passportIssueDate: Date | null
  birthday: Date | null
  gender: string
  birthPlace: string
  address: string
}

const initialFormState: FormState = {
  phone1: '',
  phone2: '',
  email: '',
  familyStatus: '',
  numberOfChildren: '',
  password: '',
  confirmPassword: '',
  surname: '',
  name: '',
  patronymic: '',
  passportSeries: '',
  passportIssuer: '',
  passportIssueDate: null,
  birthday: null,
  gender: '',
  birthPlace: '',
  address: ''
}

const CreateEmployee = () => {
  const { t } = useLang()
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState<FormState>(initialFormState)

  useEffect(() => {
    // Api call goes here to update fields with existing values
  }, [id])

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleDateChange = (field: keyof FormState) => (date: Date | null) => {
    setForm(prev => ({ ...prev, [field]: date }))
  }

  const onCancel = () => {
    setForm(initialFormState)
  }

  const onSubmit = () => {
    console.log(form)
  }

  return (
    <Stack sx={{ flexDirection: 'column', gap: 5 }}>
      <Box display='flex' gap={1}>
        <Link href='/employees' style={{ textDecoration: 'none' }}>
          <Title title={t.pages.employees} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
        </Link>
        <Typography variant='h6' color='#7F7F7FE5'>
          /
        </Typography>
        <Title title={t['edit-employee']} />
      </Box>

      <Card sx={{ padding: '24px 20px', backgroundColor: '#fff' }}>
        <Typography variant='h5' sx={{ fontWeight: 700, mb: 4 }}>
          {t.forms.employees['personal-details']}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography>{t.forms.employees.phone}</Typography>
            <InputMask mask='99 999 99 99' value={form.phone1} onChange={handleChange('phone1')}>
              {(inputProps: any) => (
                <CustomTextField
                  {...inputProps}
                  fullWidth
                  placeholder='00 000 00 00'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>+998</InputAdornment>
                  }}
                />
              )}
            </InputMask>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.employees.phone}</Typography>
            <InputMask mask='99 999 99 99' value={form.phone2} onChange={handleChange('phone2')}>
              {(inputProps: any) => (
                <CustomTextField
                  {...inputProps}
                  fullWidth
                  placeholder='00 000 00 00'
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>+998</InputAdornment>
                  }}
                />
              )}
            </InputMask>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.employees.email}</Typography>
            <CustomTextField fullWidth type='email' value={form.email} onChange={handleChange('email')} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.employees['family-status']}</Typography>
            <CustomTextField fullWidth value={form.familyStatus} onChange={handleChange('familyStatus')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees['number-of-children']}</Typography>
            <CustomTextField fullWidth value={form.numberOfChildren} onChange={handleChange('numberOfChildren')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees.password}</Typography>
            <CustomTextField fullWidth value={form.password} onChange={handleChange('password')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees['confirm-password']}</Typography>
            <CustomTextField fullWidth value={form.confirmPassword} onChange={handleChange('confirmPassword')} />
          </Grid>
        </Grid>

        <Typography variant='h5' sx={{ fontWeight: 700, mb: 4, mt: 6 }}>
          {t.forms.employees['passport-details']}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees.surname}</Typography>
            <CustomTextField fullWidth value={form.surname} onChange={handleChange('surname')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees.name}</Typography>
            <CustomTextField fullWidth value={form.name} onChange={handleChange('name')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees.patronymic}</Typography>
            <CustomTextField fullWidth value={form.patronymic} onChange={handleChange('patronymic')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees['passport-series']}</Typography>
            <CustomTextField fullWidth value={form.passportSeries} onChange={handleChange('passportSeries')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees['passport-issuer']}</Typography>
            <CustomTextField fullWidth value={form.passportIssuer} onChange={handleChange('passportIssuer')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees['passport-issue-date']}</Typography>
            <DatePickerWrapper>
              <DatePicker
                selected={form.passportIssueDate}
                onChange={handleDateChange('passportIssueDate')}
                dateFormat='dd.MM.yyyy'
                customInput={
                  <CustomTextField
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Icon svg='/icons/date.svg' color='#2F2B3D' width={20} height={20} />
                        </InputAdornment>
                      )
                    }}
                  />
                }
              />
            </DatePickerWrapper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.employees.birthday}</Typography>
            <DatePickerWrapper>
              <DatePicker
                selected={form.birthday}
                onChange={handleDateChange('birthday')}
                dateFormat='dd.MM.yyyy'
                customInput={
                  <CustomTextField
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Icon svg='/icons/date.svg' color='#2F2B3D' width={20} height={20} />
                        </InputAdornment>
                      )
                    }}
                  />
                }
              />
            </DatePickerWrapper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.employees.gender}</Typography>
            <CustomTextField select fullWidth value={form.gender} onChange={handleChange('gender')}>
              <MenuItem value='male'>{t.man}</MenuItem>
              <MenuItem value='female'>{t.woman}</MenuItem>
            </CustomTextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.employees.birthPlace}</Typography>
            <CustomTextField fullWidth value={form.birthPlace} onChange={handleChange('birthPlace')} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.employees.address}</Typography>
            <CustomTextField fullWidth value={form.address} onChange={handleChange('address')} />
          </Grid>
        </Grid>
      </Card>

      <Stack direction='row' justifyContent='flex-start' gap={3}>
        <Button variant='outlined' onClick={onCancel} sx={{ width: { md: 'max-content', xs: '100%' } }}>
          {t.forms.cancel}
        </Button>
        <Button variant='tonal' onClick={onSubmit} sx={{ width: { md: 'max-content', xs: '100%' } }}>
          {t.forms.submit}
        </Button>
      </Stack>
    </Stack>
  )
}

export default CreateEmployee
