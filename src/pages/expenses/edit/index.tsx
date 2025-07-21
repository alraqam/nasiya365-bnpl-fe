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

interface FormState {
  name: string
  amount: string
  date: Date | null
}

const initialFormState: FormState = {
  name: '',
  amount: '',
  date: null
}

const CreateExpense = () => {
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

  const handleDateChange = (date: Date | null) => {
    setForm(prev => ({ ...prev, date }))
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
        <Link href='/expenses' style={{ textDecoration: 'none' }}>
          <Title title={t.pages.expenses} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
        </Link>
        <Typography variant='h6' color='#7F7F7FE5'>
          /
        </Typography>
        <Title title={t['add-expense']} />
      </Box>

      <Card sx={{ padding: '24px 20px', backgroundColor: '#fff' }}>
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
                selected={form.date}
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

export default CreateExpense
