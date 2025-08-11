import { Box, Button, Card, Grid, Stack, styled, Typography } from '@mui/material'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import { useRouter } from 'next/router'
import { useLang } from 'src/providers/LanguageProvider'
import { api } from 'src/configs/api'
import { PostResponse } from 'src/@core/types/base-response'
import toast from 'react-hot-toast'
import useFetch from 'src/hooks/useFetch'

interface Response {
  status: boolean
  data: {
    id: number
    imei: string
    imei_2: null | string
    model: string
    provider: string
    account: null | string
    incoming_price: number
    status: number
    created_at: Date
    updated_at: Date
  }
}

const initialFormState = {
  provider: '',
  imei: '',
  model: '',
  incoming_price: ''
}

const CreateProduct = () => {
  const { t } = useLang()
  const router = useRouter()

  const [form, setForm] = useState(initialFormState)
  const [loading, setLoading] = useState(false)
  const { id } = router.query

  const { data } = useFetch<Response>(`/api/devices/${id}`)

  useEffect(() => {
    setForm({
      provider: data?.data.provider || '',
      imei: data?.data.imei || '',
      model: data?.data.model || '',
      incoming_price: data?.data.incoming_price.toString() || ''
    })
  }, [data])

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const onCancel = async () => {
    setForm(initialFormState)
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const res = (await api(`/api/devices/${id}`, {
        method: 'PUT',
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
        <Title title={t['edit-product']} />
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
            <Typography variant='body1'>{t.forms.products.account}</Typography>
            <CustomTextField fullWidth value={form.incoming_price} onChange={handleChange('incoming_price')} />
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
