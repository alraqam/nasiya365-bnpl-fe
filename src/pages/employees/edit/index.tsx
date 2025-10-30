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
import { initialEmployeeForm, requiredEmployeeFormFields } from '../create'
import { api } from 'src/configs/api'
import dateToString from 'src/@core/utils/date-to-string'
import { PostResponse, Response } from 'src/@core/types/base-response'
import useFetch from 'src/hooks/useFetch'
import IRole from 'src/@core/types/role'
import { Employee as IEmployee } from 'src/@core/types/employee'
import CollapsibleSection from 'src/@core/components/CollapsibleSection'
import { ApiResponse } from 'src/@core/types/api'

const CreateEmployee = () => {
  const { t } = useLang()
  const router = useRouter()
  const { id } = router.query

  const [form, setForm] = useState(initialEmployeeForm)
  const [loading, setLoading] = useState(false)

  const { data: roles } = useFetch<ApiResponse<IRole[]>>('/api/tenant-roles')
  const { data } = useFetch<{
    status: boolean
    data: IEmployee
  }>(`/api/employees/${id}`)

  useEffect(() => {
    setForm({
      phone: data?.data.phone || '',
      phone2: '',
      email: data?.data.email || '',
      password: '',
      confirm_password: '',
      name: data?.data.name || '',
      surname: '',
      middle_name: '',
      passport: '',
      place_of_issue: '',
      date_of_issue: null,
      date_of_birth: null,
      gender: '0',
      place_of_birth: '',
      place_of_residence: '',
      role_id: (data?.data.role?.id) || 0
    })
  }, [data])

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleDateChange = (field: keyof typeof form) => (date: Date | null) => {
    setForm(prev => ({ ...prev, [field]: date }))
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const res = (await api(`/api/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...form,
          phone: form.phone ? form.phone.replace(/\D/g, '') : '',
          phone2: form.phone2 ? form.phone2.replace(/\D/g, '') : '',
          date_of_issue: dateToString(form.date_of_issue),
          date_of_birth: dateToString(form.date_of_birth)
        })
      })) as PostResponse<keyof typeof initialEmployeeForm>

      if (res.status) {
        setForm(initialEmployeeForm)
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
      <Box display='flex' gap={1} alignItems='center'>
        <Link href='/employees' passHref legacyBehavior>
          <Box component='a' sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Title title={t.pages.employees} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
          </Box>
        </Link>
        <Typography variant='h6' color='#7F7F7FE5'>
          /
        </Typography>
        <Title title={t['edit-employee']} />
      </Box>

      {/* Personal Details */}
      <CollapsibleSection title={t.forms.employees['personal-details']} defaultOpen>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography>
              {t.forms.employees.phone} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <InputMask mask='99 999 99 99' value={form.phone} onChange={handleChange('phone')}>
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
            <Typography>{t.forms.employees['role']}</Typography>
            <CustomTextField select fullWidth value={form.role_id} onChange={handleChange('role_id')}>
              {(roles?.data || []).map(role => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name || role.label}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.employees.password}</Typography>
            <CustomTextField fullWidth value={form.password} onChange={handleChange('password')} type='password' />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.employees['confirm-password']}</Typography>
            <CustomTextField
              fullWidth
              value={form.confirm_password}
              onChange={handleChange('confirm_password')}
              type='password'
            />
          </Grid>
        </Grid>
      </CollapsibleSection>

      {/* Passport Details */}
      <CollapsibleSection title={t.forms.employees['passport-details']}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography>
              {t.forms.employees.surname} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField fullWidth value={form.surname} onChange={handleChange('surname')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              {t.forms.employees.name} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField fullWidth value={form.name} onChange={handleChange('name')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>{t.forms.employees.patronymic}</Typography>
            <CustomTextField fullWidth value={form.middle_name} onChange={handleChange('middle_name')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              {t.forms.employees['passport-series']} <span style={{ color: 'red' }}>*</span>
            </Typography>
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
                showPopperArrow={false}
                customInput={
                  <CustomTextField
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end' sx={{ pointerEvents: 'none' }}>
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
            <Typography>
              {t.forms.employees.birthday} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <DatePickerWrapper>
              <DatePicker
                selected={form.date_of_birth}
                onChange={handleDateChange('date_of_birth')}
                dateFormat='dd.MM.yyyy'
                showPopperArrow={false}
                customInput={
                  <CustomTextField
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end' sx={{ pointerEvents: 'none' }}>
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
            <Typography>
              {t.forms.employees.gender} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField select fullWidth value={form.gender} onChange={handleChange('gender')}>
              <MenuItem value='1'>{t.man}</MenuItem>
              <MenuItem value='0'>{t.woman}</MenuItem>
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
      </CollapsibleSection>

      <Stack direction='row' justifyContent='flex-start' gap={3}>
        <Button
          disabled={
            loading ||
            Object.entries(form).some(
              ([key, value]) => requiredEmployeeFormFields.includes(key as keyof typeof initialEmployeeForm) && !value
            )
          }
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
