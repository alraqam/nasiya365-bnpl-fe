import { Box, Button, Card, Grid, InputAdornment, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import { useLang } from 'src/providers/LanguageProvider'
import InputMask from 'react-input-mask'
import { useRouter } from 'next/router'
import useFetch from 'src/hooks/useFetch'
import { Investor as IInvestor } from 'src/@core/types/investor'
import { api } from 'src/configs/api'
import CollapsibleSection from 'src/@core/components/CollapsibleSection'
import checkRequiredFields from 'src/@core/utils/check-required-fields'

const initialFormState = {
  name: '',
  passport: '',
  phone: '',
  percentage: ''
}

const requiredFields = ['name', 'passport', 'phone', 'percentage']

const EditInvestor = () => {
  const { t } = useLang()
  const router = useRouter()
  const { id } = router.query

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(initialFormState)

  const { data } = useFetch<{ data: IInvestor }>(`/api/investors/${id}`)

  useEffect(() => {
    setForm({
      name: data?.data.name || '',
      passport: '',
      phone: data?.data.phone || '',
      percentage: ''
    })
  }, [data])

  const handleChange = (field: keyof typeof initialFormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const onSubmit = async () => {
    try {
      setLoading(true)
      const res = await api(`/api/investors/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...form, phone: form.phone.replace(/\D/g, '') })
      })
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
        <Title title={t['edit-investor']} />
      </Box>

      <CollapsibleSection title='Asosiy' defaultOpen>
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

export default EditInvestor
