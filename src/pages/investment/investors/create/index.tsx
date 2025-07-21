import { Box, Button, Card, Grid, InputAdornment, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import { useLang } from 'src/providers/LanguageProvider'
import InputMask from 'react-input-mask'

interface FormState {
  fio: string
  passport: string
  phone: string
  percent: string
}

const initialFormState: FormState = {
  fio: '',
  passport: '',
  phone: '',
  percent: ''
}

const CreateInvestor = () => {
  const { t } = useLang()

  const [form, setForm] = useState<FormState>(initialFormState)

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
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
        <Link href='/investment/investors' style={{ textDecoration: 'none' }}>
          <Title title={t.pages.investment.investors} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
        </Link>
        <Typography variant='h6' color='#7F7F7FE5'>
          /
        </Typography>
        <Title title={t['add-investor']} />
      </Box>

      <Card sx={{ padding: '24px 20px', backgroundColor: '#fff' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography>{t.forms.investors.fio}</Typography>
            <CustomTextField
              fullWidth
              placeholder={t.forms.investors.placeholder.fio}
              value={form.fio}
              onChange={handleChange('fio')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.investors.passport}</Typography>
            <CustomTextField
              fullWidth
              placeholder={t.forms.investors.placeholder.passport}
              value={form.passport}
              onChange={handleChange('passport')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.investors.phone}</Typography>
            <InputMask mask='99 999 99 99' value={form.phone} onChange={handleChange('phone')}>
              {(inputProps: any) => (
                <CustomTextField
                  {...inputProps}
                  placeholder={t.forms.investors.placeholder.phone}
                  variant='outlined'
                  fullWidth
                  sx={{ borderRadius: '8px' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start' sx={{ marginRight: '4px' }}>
                        +998
                      </InputAdornment>
                    )
                  }}
                />
              )}
            </InputMask>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.investors.percent}</Typography>
            <CustomTextField
              fullWidth
              placeholder={t.forms.investors.placeholder.percent}
              value={form.percent}
              onChange={handleChange('percent')}
            />
          </Grid>
        </Grid>
      </Card>

      <Stack direction='row' justifyContent='flex-start' gap={3}>
        <Button variant='outlined' onClick={onCancel} sx={{ width: { xs: '100%', md: 'max-content' } }}>
          {t.forms.cancel}
        </Button>
        <Button variant='tonal' onClick={onSubmit} sx={{ width: { xs: '100%', md: 'max-content' } }}>
          {t.forms.submit}
        </Button>
      </Stack>
    </Stack>
  )
}

export default CreateInvestor
