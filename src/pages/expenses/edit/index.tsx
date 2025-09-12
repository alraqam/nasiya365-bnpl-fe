import { Box, Button, Card, Grid, InputAdornment, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useLang } from 'src/providers/LanguageProvider'
import DatePicker from 'react-datepicker'
import { useRouter } from 'next/router'
import useFetch from 'src/hooks/useFetch'
import IExpense from 'src/@core/types/expense'
import { api } from 'src/configs/api'
import dateToString from 'src/@core/utils/date-to-string'
import { PostResponse } from 'src/@core/types/base-response'
import CollapsibleSection from 'src/@core/components/CollapsibleSection'
import checkRequiredFields from 'src/@core/utils/check-required-fields'

interface Response {
  status: boolean
  data: IExpense
}

const initialFormState = {
  name: '',
  amount: '',
  created_at: null as Date | null
}

const requiredFields = ['name', 'amount', 'created_at']

const CreateExpense = () => {
  const { t } = useLang()
  const router = useRouter()
  const { id } = router.query

  const [form, setForm] = useState(initialFormState)
  const [loading, setLoading] = useState(false)

  const { data } = useFetch<Response>(`/api/costs/${id}`)

  useEffect(() => {
    const createdAt = data?.data.created_at

    setForm({
      name: data?.data.name || '',
      amount: data?.data.amount.toString() || '',
      created_at: createdAt ? new Date(createdAt) : null
    })
  }, [data])

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleDateChange = (date: Date | null) => {
    setForm(prev => ({ ...prev, date }))
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const res = (await api(`/api/costs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...form, created_at: dateToString(form.created_at!), type: 'Boshqa' })
      })) as PostResponse<keyof typeof initialFormState>
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
        <Link href='/expenses' style={{ textDecoration: 'none' }}>
          <Title title={t.pages.expenses} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
        </Link>
        <Typography variant='h6' color='#7F7F7FE5'>
          /
        </Typography>
        <Title title={t['add-expense']} />
      </Box>

      <CollapsibleSection title='Asosiy' defaultOpen>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography>{t.forms.expenses.name}</Typography>
            <CustomTextField
              fullWidth
              placeholder={t.forms.expenses.placeholder.name}
              value={form.name}
              onChange={handleChange('name')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.expenses.amount}</Typography>
            <CustomTextField
              fullWidth
              placeholder={t.forms.expenses.placeholder.amount}
              value={form.amount}
              onChange={handleChange('amount')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.expenses.date}</Typography>
            <DatePickerWrapper>
              <DatePicker
                selected={form.created_at}
                onChange={handleDateChange}
                dateFormat='dd.MM.yyyy'
                customInput={
                  <CustomTextField
                    fullWidth
                    placeholder={t.forms.expenses.placeholder.date}
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
        </Grid>
      </CollapsibleSection>

      <Stack direction='row' justifyContent='flex-start' gap={3}>
        <Button
          disabled={loading || checkRequiredFields(requiredFields, form)}
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

export default CreateExpense
