import { Box, Button, Card, Divider, Grid, Stack, styled, Typography } from '@mui/material'
import { useLang } from 'src/providers/LanguageProvider'
import { PaddingBox, RightSideBox, StepChildrenProps } from '.'
import AddressCard from 'src/components/checkout/AddressCard'
import { useState } from 'react'
import Chip from 'src/@core/components/mui/chip'
import DeliveryPlanCard from 'src/components/checkout/DeliveryPlanCard'

const items = [
  {
    id: 1,
    img: '/images/test-phone.png',
    title: 'Apple iPhone 16 Pro Max (256 GB, Desert)',
    date: '20 sentabr 2025'
  },
  {
    id: 2,
    img: '/images/test-phone.png',
    title: 'Apple iPhone 16 Pro Max (256 GB, Desert)',
    date: '20 sentabr 2025'
  }
]

const addresses = [
  {
    id: 1,
    name: 'Jamshid Abdurasulov',
    location: 'Olmazor tumani, Kichik xalqa yo’li, 5A',
    number: '+998 97 701 23 78 ',
    payment: 'Yetkazib berishda karta orqali',
    address_of: 'Uy'
  },
  {
    id: 2,
    name: 'Jamshid Abdurasulov',
    location: 'Yunusobot tumani, Oqilota ko’chasi 26/11',
    number: '+998 97 701 23 78 ',
    payment: 'Yetkazib berishda karta orqali',
    address_of: 'Ofis'
  }
]

const deliveryPlans = [
  {
    id: 1,
    icon: '/icons/user.svg',
    title: 'Mustaqil olib ketish',
    desc: 'Mahsulotingizni 1 zumda oling.',
    price: 0
  },
  {
    id: 2,
    icon: '/icons/star.svg',
    title: 'Standard',
    desc: 'Yetkazib berish 1 kun ichida.',
    price: 2
  },
  {
    id: 3,
    icon: '/icons/crown.svg',
    title: 'Express',
    desc: 'Yetkazib berish 5soat ichida.',
    price: 5
  }
]

const Address = ({ setStep }: StepChildrenProps) => {
  const { t } = useLang()

  const [form, setForm] = useState({
    address: 1,
    delivery: 0
  })

  const handleAddress = (id: number) => {
    setForm(prev => ({ ...prev, address: id }))
  }

  const handleDelivery = (id: number) => {
    setForm(prev => ({ ...prev, delivery: id }))
  }

  const handleSubmit = async () => {
    setStep(2)
  }

  return (
    <Stack sx={{ flexDirection: 'row', gap: '24px', padding: '24px', position: 'relative' }}>
      {/* Left side */}
      <Stack sx={{ flex: 1, gap: 6 }}>
        {/* Address */}
        <Box>
          <Typography fontWeight={600} sx={{ mb: '16px' }}>
            {t.checkout.enter_address}
          </Typography>

          <Grid container spacing={6}>
            {addresses.map(item => (
              <Grid item xs={6} key={item.id}>
                <AddressCard {...item} isSelected={form.address === item.id} handleSelect={handleAddress} />
              </Grid>
            ))}
          </Grid>

          <Button variant='tonal' sx={{ mt: 4 }}>
            {t.checkout.add_new_address}
          </Button>
        </Box>

        {/* Delivery */}
        <Box>
          <Typography fontWeight={600} sx={{ mb: '16px' }}>
            {t.checkout.fast_delivery_plan}
          </Typography>

          <Grid container spacing={6}>
            {deliveryPlans.map(item => (
              <Grid item xs={4} key={item.id}>
                <DeliveryPlanCard {...item} isSelected={form.delivery === item.id} handleSelect={handleDelivery} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>

      {/* Right side */}
      <RightSideBox>
        <Card variant='outlined' sx={{ boxShadow: 'none' }}>
          <PaddingBox>
            <Typography fontWeight={600} sx={{ mb: 4 }}>
              {t.checkout.possible_delivery_day}
            </Typography>
            <Stack gap={4}>
              {items.map(item => (
                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '70px',
                      height: '70px'
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ objectFit: 'contain', width: '40px', height: '50px' }}
                    />
                  </Box>
                  <Box>
                    <Typography fontWeight={600} color='#2F2B3DB2'>
                      {item.title}
                    </Typography>
                    <Typography fontWeight={600} color='#2F2B3DB2'>
                      {item.date}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </PaddingBox>

          <Divider sx={{ margin: '0px !important' }} />

          <PaddingBox sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography fontWeight={600} sx={{ mb: 4 }}>
              {t.checkout.price_reports}
            </Typography>
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography fontWeight={600}>{t.checkout.orders.replace('?', '2')}</Typography>
              <Typography sx={{ opacity: '80%' }}>$1465.00</Typography>
            </Stack>
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography fontWeight={600}>{t.checkout.discount}</Typography>
              <Typography sx={{ opacity: '80%' }}>$0</Typography>
            </Stack>
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography fontWeight={600}>{t.checkout.delivery}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Typography sx={{ textDecoration: 'line-through', opacity: '80%' }}>$5</Typography>
                <Chip skin='light' color='success' rounded label={t.checkout.free} />
              </Box>
            </Stack>
          </PaddingBox>

          <Divider sx={{ margin: '0px !important' }} />

          <PaddingBox>
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography fontWeight={600}>{t.checkout.total}</Typography>
              <Typography>$1465.00</Typography>
            </Stack>
          </PaddingBox>
        </Card>
        <Button variant='contained' fullWidth onClick={handleSubmit} sx={{ mt: '16px' }}>
          {t.checkout.confirm}
        </Button>
      </RightSideBox>
    </Stack>
  )
}

export default Address
