import { Box, Button, Card, Grid, InputAdornment, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import { useLang } from 'src/providers/LanguageProvider'
import InputMask from 'react-input-mask'
import { api } from 'src/configs/api'
import { PostResponse } from 'src/@core/types/base-response'

const initialFormState = {
  name: '',
  passport: '',
  phone: '',
  percentage: ''
}

const CreateInvestor = () => {
  const { t } = useLang()

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(initialFormState)

  const handleChange = (field: keyof typeof initialFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const onCancel = () => {
    setForm(initialFormState)
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const res = (await api('/api/investors', {
        method: 'POST',
        body: JSON.stringify({ ...form, phone: form.phone.replace(/\D/g, '') })
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
              value={form.name}
              onChange={handleChange('name')}
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
              value={form.percentage}
              onChange={handleChange('percentage')}
            />
          </Grid>
        </Grid>
      </Card>

      <Stack direction='row' justifyContent='flex-start' gap={3}>
        <Button
          disabled={loading}
          variant='outlined'
          onClick={onCancel}
          sx={{ width: { xs: '100%', md: 'max-content' } }}
        >
          {t.forms.cancel}
        </Button>
        <Button disabled={loading} variant='tonal' onClick={onSubmit} sx={{ width: { xs: '100%', md: 'max-content' } }}>
          {t.forms.submit}
        </Button>
      </Stack>
    </Stack>
  )
}

export default CreateInvestor
