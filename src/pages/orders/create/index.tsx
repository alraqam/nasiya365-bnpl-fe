import { Box, Button, Card, Grid, InputAdornment, MenuItem, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import Title from 'src/@core/components/title'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Icon from 'src/@core/components/icon/icon'
import DatePicker from 'react-datepicker'
import { useLang } from 'src/providers/LanguageProvider'

const initialFormState = {
  client: '',
  comment: '',
  device: '',
  deviceDocument: '',
  paymentDueMonth: '',
  paymentDay: '',
  orderDate: null as Date | null,
  totalPrice: '',
  price: '',
  downPayment: ''
}

const CreateOrder = () => {
  const { t } = useLang()
  const [form, setForm] = useState(initialFormState)

  const handleChange = (field: keyof typeof form) => (e: any) => {
    setForm(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleDateChange = (date: Date | null) => {
    setForm(prev => ({
      ...prev,
      orderDate: date
    }))
  }

  const onCancel = () => {
    setForm(initialFormState)
  }

  const onSubmit = () => {
    console.log(form)
    // Backend interaction goes here
  }

  return (
    <Stack sx={{ flexDirection: 'column', gap: 5 }}>
      <Box display='flex' gap={1}>
        <Link href='/orders' style={{ textDecoration: 'none' }}>
          <Title title={t.pages.orders} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
        </Link>
        <Typography variant='h6' color='#7F7F7FE5'>
          /
        </Typography>
        <Title title={t['add-order']} />
      </Box>

      <Card sx={{ padding: '24px 20px', backgroundColor: '#fff' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant='body1'>{t.forms.orders.client}</Typography>
            <CustomTextField fullWidth value={form.client} onChange={handleChange('client')} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant='body1'>{t.forms.orders.comment}</Typography>
            <CustomTextField fullWidth value={form.comment} onChange={handleChange('comment')} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant='body1'>
              {t.forms.orders.device} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField fullWidth value={form.device} onChange={handleChange('device')} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant='body1'>
              {t.forms.orders.device_doc} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField select fullWidth value={form.deviceDocument} onChange={handleChange('deviceDocument')}>
              <MenuItem value='true'>{t.given}</MenuItem>
              <MenuItem value='false'>{t['not-given']}</MenuItem>
            </CustomTextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              {t.forms.orders.payment_due_monthly} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField fullWidth value={form.paymentDueMonth} onChange={handleChange('paymentDueMonth')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              {t.forms.orders.payment_due_day} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField fullWidth value={form.paymentDay} onChange={handleChange('paymentDay')} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              {t.forms.orders.order_date} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <DatePickerWrapper>
              <DatePicker
                selected={form.orderDate}
                onChange={handleDateChange}
                dateFormat='dd.MM.yyyy'
                customInput={
                  <CustomTextField
                    fullWidth
                    variant='filled'
                    value={form.orderDate ? form.orderDate.toLocaleDateString() : ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <Icon svg='/icons/date.svg' color='#2F2B3D' width={20} height={20} />
                        </InputAdornment>
                      )
                    }}
                  />
                }
              />
            </DatePickerWrapper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              {t.forms.orders.total_price} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField
              fullWidth
              value={form.totalPrice}
              onChange={handleChange('totalPrice')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start' sx={{ mr: '1px' }}>
                    $
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant='body1'>
              {t.forms.orders.price} <span style={{ color: 'red' }}>*</span>
            </Typography>
            <CustomTextField
              fullWidth
              value={form.price}
              onChange={handleChange('price')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start' sx={{ mr: '1px' }}>
                    $
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant='body1'>{t.forms.orders.initial_payment}</Typography>
            <CustomTextField
              fullWidth
              value={form.downPayment}
              onChange={handleChange('downPayment')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start' sx={{ mr: '1px' }}>
                    $
                  </InputAdornment>
                )
              }}
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

export default CreateOrder
