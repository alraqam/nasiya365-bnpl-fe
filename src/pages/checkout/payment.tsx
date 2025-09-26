import { Box, Button, Card, Divider, Grid, Stack, Typography } from '@mui/material'
import { useLang } from 'src/providers/LanguageProvider'
import { PaddingBox, RightSideBox, StepChildrenProps, Wrapper } from '.'
import Chip from 'src/@core/components/mui/chip'
import { useState } from 'react'

const payments = [
  {
    id: 1,
    img: '/icons/payment/click.svg'
  },
  {
    id: 2,
    img: '/icons/payment/payme.svg'
  },
  {
    id: 3,
    img: '/icons/payment/uzumbank.svg'
  },
  {
    id: 4,
    img: '/icons/payment/alif.svg'
  },
  {
    id: 5,
    img: '/icons/payment/paynet.svg'
  },
  {
    id: 6,
    img: '/icons/payment/cash.svg'
  }
]

const Payment = ({ setStep }: StepChildrenProps) => {
  const { t } = useLang()

  const handleSubmit = async () => {
    setStep(4)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <Wrapper>
      {/* Left side */}
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            mb: '24px'
          }}
        >
          <Button variant='contained'>{t.checkout.cash_and_others}</Button>
          <Typography fontWeight={600} textAlign={'center'}>
            {t.checkout.payment_when_delivery}
          </Typography>
        </Box>

        <Grid container spacing={5}>
          {payments.map(item => (
            <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: 100,
                  border: '1px solid #2F2B3D1F',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <img src={item.img} alt='payment provider' />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Right side */}
      <RightSideBox>
        <Card variant='outlined' sx={{ boxShadow: 'none' }}>
          <PaddingBox>
            <Typography fontWeight={600} sx={{ mb: 4 }}>
              {t.checkout.price_reports}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography fontWeight={600}>{t.checkout.delivery}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Typography sx={{ textDecoration: 'line-through', opacity: '80%' }}>$5</Typography>
                  <Chip skin='light' rounded color='success' label={t.checkout.free} />
                </Box>
              </Stack>
              <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography fontWeight={600}>{t.checkout.orders.replace('?', '2')}</Typography>
                <Typography sx={{ opacity: '80%' }}>$1465.00</Typography>
              </Stack>
            </Box>
          </PaddingBox>

          <Divider sx={{ margin: '0px !important' }} />

          <PaddingBox sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography fontWeight={600}>{t.checkout.delivery}</Typography>
              <Chip skin='light' rounded color='primary' label={t.other} />
            </Stack>
            <Box sx={{ color: '#2F2B3DB2' }}>
              <Typography fontWeight={600}>Jamshid Abdurasulov</Typography>
              <Typography>Olmazor tumani, Kichiq xalqa yo’li, 5A</Typography>
              <Typography>{t.phone}: +998 97 701 23 78</Typography>
            </Box>
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography fontWeight={600}>{t.checkout.total}</Typography>
              <Typography sx={{ opacity: '80%' }}>$1465.00</Typography>
            </Stack>
          </PaddingBox>
        </Card>
        <Button variant='contained' fullWidth onClick={handleSubmit} sx={{ mt: '16px' }}>
          {t.checkout.confirm}
        </Button>
      </RightSideBox>
    </Wrapper>
  )
}

export default Payment
