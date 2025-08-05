import { Box, Button, Card, Grid, InputAdornment, MenuItem, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import Icon from 'src/@core/components/icon/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useLang } from 'src/providers/LanguageProvider'
import DatePicker from 'react-datepicker'
import InputMask from 'react-input-mask'
import { api } from 'src/configs/api'
import dateToString from 'src/@core/utils/date-to-string'
import { PostResponse, Response } from 'src/@core/types/base-response'
import useFetch from 'src/hooks/useFetch'
import IRole from 'src/@core/types/role'

const initialFormState = {
  phone1: '',
  phone2: '',
  email: '',
  password: '',
  confirm_password: '',
  name: '',
  surname: '',
  middle_name: '',
  passport: '',
  place_of_issue: '',
  date_of_issue: null,
  date_of_birth: null,
  gender: '',
  place_of_birth: '',
  place_of_residence: '',
  role_id: null
}

const CreateEmployee = () => {
  const { t } = useLang()

  const [form, setForm] = useState(initialFormState)
  const [loading, setLoading] = useState(false)

  const { data: roles } = useFetch<Response<IRole[]>>('/api/roles')

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleDateChange = (field: keyof typeof form) => (date: Date | null) => {
    setForm(prev => ({ ...prev, [field]: date }))
  }

  const onCancel = () => {
    setForm(initialFormState)
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const res = (await api('/api/admins', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          phone1: form.phone1.replace(/\D/g, ''),
          phone2: form.phone1.replace(/\D/g, ''),
          date_of_issue: dateToString(form.date_of_issue!),
          date_of_birth: dateToString(form.date_of_birth!)
        })
      })) as PostResponse<keyof typeof initialFormState>

      if (res.status) {
        setForm(initialFormState)
      }
      console.log(res)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
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
        <Title title={t['add-employee']} />
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
            <CustomTextField select fullWidth value={form.role_id} onChange={handleChange('role_id')}>
              {roles?.data.data.map(role => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.employees.password}</Typography>
            <CustomTextField fullWidth value={form.password} onChange={handleChange('password')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees['confirm-password']}</Typography>
            <CustomTextField fullWidth value={form.confirm_password} onChange={handleChange('confirm_password')} />
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
            <CustomTextField fullWidth value={form.middle_name} onChange={handleChange('middle_name')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees['passport-series']}</Typography>
            <CustomTextField fullWidth value={form.passport} onChange={handleChange('passport')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees['passport-issuer']}</Typography>
            <CustomTextField fullWidth value={form.place_of_issue} onChange={handleChange('place_of_issue')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees['passport-issue-date']}</Typography>
            <DatePickerWrapper>
              <DatePicker
                selected={form.date_of_issue}
                onChange={handleDateChange('date_of_issue')}
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
                selected={form.date_of_birth}
                onChange={handleDateChange('date_of_birth')}
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
            <CustomTextField fullWidth value={form.place_of_birth} onChange={handleChange('place_of_birth')} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.employees.address}</Typography>
            <CustomTextField fullWidth value={form.place_of_residence} onChange={handleChange('place_of_residence')} />
          </Grid>
        </Grid>
      </Card>

      <Stack direction='row' justifyContent='flex-start' gap={3}>
        <Button
          disabled={loading || Object.values(form).some(item => !item)}
          variant='outlined'
          onClick={onCancel}
          sx={{ width: { md: 'max-content', xs: '100%' } }}
        >
          {t.forms.cancel}
        </Button>
        <Button
          disabled={loading || Object.values(form).some(item => !item)}
          variant='tonal'
          onClick={onSubmit}
          sx={{ width: { md: 'max-content', xs: '100%' } }}
        >
          {t.forms.submit}
        </Button>
      </Stack>
    </Stack>
  )
}

export default CreateEmployee
