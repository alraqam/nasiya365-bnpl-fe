import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'

const initialFormState = {
  supplier: '',
  imei: '',
  model: '',
  account: ''
}

const CreateProduct = () => {
  const { t } = useTranslation()

  const [form, setForm] = useState(initialFormState)

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
        <Link href='/products' style={{ textDecoration: 'none' }}>
          <Title title={t('pages.products')} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
        </Link>
        <Typography variant='h6' color='#7F7F7FE5'>
          /
        </Typography>
        <Title title={t('product')} />
      </Box>

      <Card sx={{ padding: '24px 20px', backgroundColor: '#fff' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography variant='body1'>
              Yetkazib beruvchi <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField fullWidth value={form.supplier} onChange={handleChange('supplier')} />
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography variant='body1'>
              IMEI <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField fullWidth value={form.imei} onChange={handleChange('imei')} />
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography variant='body1'>
              Model <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField fullWidth value={form.model} onChange={handleChange('model')} />
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography variant='body1'>Akkount (Gmail)</Typography>
            <CustomTextField fullWidth value={form.account} onChange={handleChange('account')} />
          </Grid>
        </Grid>
      </Card>

      <Stack direction='row' justifyContent='flex-start' gap={3}>
        <Button variant='outlined' onClick={onCancel} sx={{ width: { xs: '100%', md: 'max-content' } }}>
          Bekor qilish
        </Button>
        <Button variant='tonal' onClick={onSubmit} sx={{ width: { xs: '100%', md: 'max-content' } }}>
          Saqlash
        </Button>
      </Stack>
    </Stack>
  )
}

export default CreateProduct
