import { Box, Button, Card, Grid, MenuItem, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CollapsibleSection from 'src/@core/components/CollapsibleSection'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import { PostResponse } from 'src/@core/types/base-response'
import IInvestment from 'src/@core/types/investment'
import IInvestor from 'src/@core/types/investor'
import checkRequiredFields from 'src/@core/utils/check-required-fields'
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

const requiredFields = ['investor_id', 'amount']

const EditInvestment = () => {
  const { t } = useLang()
  const router = useRouter()
  const { id } = router.query

  const [form, setForm] = useState(initialFormState)
  const [loading, setLoading] = useState(false)

  const { data } = useFetch<{ data: IInvestment }>(`/api/investments/${id}`)
  const { data: investors } = useFetch<Response<IInvestor[]>>('/api/investors')

  useEffect(() => {
    setForm({
      investor_id: data?.data.investor_id.toString() || '',
      amount: data?.data.amount.toString() || ''
    })
  }, [data])

  const handleChange = (field: keyof typeof initialFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const res = (await api(`/api/investments/${id}`, {
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
        toast.success(t['success-edit'])
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
        <Title title={t['edit-investment']} />
      </Box>

      <CollapsibleSection title='Asosiy' defaultOpen>
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
              {investors?.data.map(investor => (
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
      </CollapsibleSection>

      <Stack direction='row' justifyContent='flex-start' gap={3}>
        <Button
          disabled={loading || checkRequiredFields(requiredFields, form)}
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

export default EditInvestment
