import { Box, Button, Card, Grid, MenuItem, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import { PostResponse } from 'src/@core/types/base-response'
import IInvestor from 'src/@core/types/investor'
import { api } from 'src/configs/api'
import useFetch from 'src/hooks/useFetch'
import { useLang } from 'src/providers/LanguageProvider'

interface Response<T> {
  current_page: string
  per_page: number
  total: number
  last_page: number
  allPercentage: string
  data: T
}

const initialFormState = {
  investor_id: '',
  amount: ''
}

const CreateInvestment = () => {
  const { t } = useLang()

  const [form, setForm] = useState(initialFormState)
  const [loading, setLoading] = useState(false)

  const { data } = useFetch<Response<IInvestor[]>>('/api/investors')

  const handleChange = (field: keyof typeof initialFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const onCancel = () => {
    setForm(initialFormState)
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const res = (await api('/api/investments', {
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
        <Link href='/investment/investments' style={{ textDecoration: 'none' }}>
          <Title title={t.pages.investment.investments} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
        </Link>
        <Typography variant='h6' color='#7F7F7FE5'>
          /
        </Typography>
        <Title title={t['add-investment']} />
      </Box>

      <Card sx={{ padding: '24px 20px', backgroundColor: '#fff' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography>{t.forms.investments.investor}</Typography>
            <CustomTextField
              select
              fullWidth
              placeholder={t.forms.investments.placeholder.investor}
              value={form.investor_id}
              onChange={handleChange('investor_id')}
            >
              {data?.data.map(investor => (
                <MenuItem key={investor.id} value={investor.id}>
                  {investor.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>{t.forms.investments.amount}</Typography>
            <CustomTextField
              fullWidth
              placeholder={t.forms.investments.placeholder.amount}
              value={form.amount}
              onChange={handleChange('amount')}
            />
          </Grid>
        </Grid>
      </Card>

      <Stack direction='row' justifyContent='flex-start' gap={3}>
        <Button
          disabled={loading || Object.values(form).some(item => !item)}
          variant='outlined'
          onClick={onCancel}
          sx={{ width: { xs: '100%', md: 'max-content' } }}
        >
          {t.forms.cancel}
        </Button>
        <Button
          disabled={loading || Object.values(form).some(item => !item)}
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

export default CreateInvestment
