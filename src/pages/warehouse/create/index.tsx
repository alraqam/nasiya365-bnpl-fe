import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import { PostResponse } from 'src/@core/types/base-response'
import { api } from 'src/configs/api'
import { useLang } from 'src/providers/LanguageProvider'

const initialFormState = {
  provider: '',
  imei: '',
  model: '',
  incoming_price: ''
}

const requiredProductFileds: (keyof typeof initialFormState)[] = ['imei', 'model', 'incoming_price', 'provider']

const CreateProduct = () => {
  const { t } = useLang()

  const [form, setForm] = useState(initialFormState)
  const [loading, setLoading] = useState(false)

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const onCancel = () => {
    setForm(initialFormState)
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const res = (await api('/api/products', {
        method: 'POST',
        body: JSON.stringify(form)
      })) as PostResponse<keyof typeof initialFormState>

      if (!res.status) {
        for (const [field, messages] of Object.entries(res.errors)) {
          for (const msg of messages) {
            toast.error(msg)
          }
        }
      } else {
        setForm(initialFormState)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack sx={{ flexDirection: 'column', gap: 5 }}>
      <Box display='flex' gap={1}>
        <Link href='/products' style={{ textDecoration: 'none' }}>
          <Title title={t.pages.products} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
        </Link>
        <Typography variant='h6' color='#7F7F7FE5'>
          /
        </Typography>
        <Title title={t['add-product']} />
      </Box>

      <Card sx={{ padding: '24px 20px', backgroundColor: '#fff' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography variant='body1'>
              {t.forms.products.supplier} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField fullWidth value={form.provider} onChange={handleChange('provider')} />
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography variant='body1'>
              {t.forms.products.imei} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField fullWidth value={form.imei} onChange={handleChange('imei')} />
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography variant='body1'>
              {t.forms.products.model} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField fullWidth value={form.model} onChange={handleChange('model')} />
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography variant='body1'>
              {t.forms.products.price} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField
              fullWidth
              type='number'
              value={form.incoming_price}
              onChange={handleChange('incoming_price')}
            />
          </Grid>
        </Grid>
      </Card>

      <Stack direction='row' justifyContent='flex-start' gap={3}>
        <Button
          disabled={loading || requiredProductFileds.some(field => !form[field])}
          variant='outlined'
          onClick={onCancel}
          sx={{ width: { xs: '100%', md: 'max-content' } }}
        >
          {t.forms.cancel}
        </Button>
        <Button
          disabled={loading || requiredProductFileds.some(field => !form[field])}
          variant='tonal'
          onClick={onSubmit}
          sx={{ width: { xs: '100%', md: 'max-content' } }}
        >
          {t.forms.submit}
        </Button>
      </Stack>
    </Stack>
  )
}

export default CreateProduct
