import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import { useLang } from 'src/providers/LanguageProvider'

interface FormState {
  investor: string
  amount: string
}

const initialFormState: FormState = {
  investor: '',
  amount: ''
}

const EditInvestment = () => {
  const { t } = useLang()
  const router = useRouter()
  const { id } = router.query

  const [form, setForm] = useState<FormState>(initialFormState)

  useEffect(() => {
    // Api call here to update the state with initial values
  }, [id])

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
        <Link href='/investment/investments' style={{ textDecoration: 'none' }}>
          <Title title={t.pages.investment.investments} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
        </Link>
        <Typography variant='h6' color='#7F7F7FE5'>
          /
        </Typography>
        <Title title={t['edit-investment']} />
      </Box>

      <Card sx={{ padding: '24px 20px', backgroundColor: '#fff' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography>{t.forms.investments.investor}</Typography>
            <CustomTextField
              fullWidth
              placeholder={t.forms.investments.placeholder.investor}
              value={form.investor}
              onChange={handleChange('investor')}
            />
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

export default EditInvestment
