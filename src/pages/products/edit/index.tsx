import { Box, Button, Card, Grid, Stack, styled, Typography } from '@mui/material'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import { useRouter } from 'next/router'
import { useLang } from 'src/providers/LanguageProvider'

const initialFormState = {
  supplier: '',
  imei: '',
  model: '',
  account: ''
}

const CreateProduct = () => {
  const { t } = useLang()
  const router = useRouter()

  const [form, setForm] = useState(initialFormState)
  const { id } = router.query

  useEffect(() => {
    // Api call goes here to update fields with existing values
  }, [id])

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
          <Title title={t.pages.products} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
        </Link>
        <Typography variant='h6' color='#7F7F7FE5'>
          /
        </Typography>
        <Title title={t['edit-product']} />
      </Box>

      <Card sx={{ padding: '24px 20px', backgroundColor: '#fff' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography variant='body1'>
              {t.forms.products.supplier} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField fullWidth value={form.supplier} onChange={handleChange('supplier')} />
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
            <Typography variant='body1'>{t.forms.products.account}</Typography>
            <CustomTextField fullWidth value={form.account} onChange={handleChange('account')} />
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

export default CreateProduct
