import { Box, Card, Divider, Grid, IconButton, Stack, styled, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import { useLang } from 'src/providers/LanguageProvider'
import Chip from 'src/@core/components/mui/chip'
import { PaddingBox, RightSideBox } from '.'

const DetailBox = styled(Box)(({ theme }) => ({
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  gap: '16px',
  height: '100%',
  borderRight: '1px solid #2F2B3D1F'
  //   [theme.breakpoints.down('sm')]: {
  //     alignItems: 'center'
  //   }
}))

const items = [
  {
    id: 1,
    img: '/images/test-phone.png',
    title: 'Apple iPhone 16 Pro Max (256 GB, Desert)',
    status: 'Yangi',
    in_stock: true,
    old_price: 180,
    new_price: 165
  },
  {
    id: 2,
    img: '/images/test-phone.png',
    title: 'Apple iPhone 16 Pro Max (256 GB, Desert)',
    status: 'Yangi',
    in_stock: true,
    old_price: 180,
    new_price: 165
  }
]

const Confirmation = () => {
  const { t } = useLang()

  return (
    <Stack sx={{ gap: '24px', padding: { xs: '16px', md: '24px' }, position: 'relative' }}>
      {/* Message */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography variant='h4' textAlign='center'>
          {t.checkout.thanks}
        </Typography>
        <Typography textAlign='center' color='#2F2B3DB2'>
          {t.checkout['your-order'].replace('?', '#1536548131')}
        </Typography>
      </Box>

      {/* Details */}
      <Card variant='outlined' sx={{ boxShadow: 'none' }}>
        <Grid container>
          {/* Address */}
          <Grid item xs={12} sm={6} md={4}>
            <DetailBox sx={{ borderBottom: { xs: '1px solid #2F2B3D1F', md: 'none' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon icon='tabler:map-pin' fontSize={20} />
                <Typography fontWeight={600}>{t.checkout.steps.address}</Typography>
              </Box>
              <Box sx={{ color: '#2F2B3DB2' }}>
                <Typography>Jamshid Abduarulov</Typography>
                <Typography>Olmazor tumani, Kichiq xalqa yo’li, 5A</Typography>
                <Typography sx={{ mt: '16px' }}>+998 97 701 23 78</Typography>
              </Box>
            </DetailBox>
          </Grid>

          {/* Payment */}
          <Grid item xs={12} sm={6} md={4}>
            <DetailBox sx={{ borderBottom: { xs: '1px solid #2F2B3D1F', md: 'none' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon icon='tabler:credit-card' fontSize={20} />
                <Typography fontWeight={600}>{t.checkout.steps.payment}</Typography>
              </Box>
              <Box sx={{ color: '#2F2B3DB2' }}>
                <Typography>Jamshid Abduarulov</Typography>
                <Typography>Naqd pul</Typography>
                <Typography sx={{ mt: '16px' }}>+998 97 701 23 78</Typography>
              </Box>
            </DetailBox>
          </Grid>

          {/* Delivery */}
          <Grid item xs={12} md={4}>
            <DetailBox>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon icon='tabler:truck-delivery' fontSize={20} />
                <Typography fontWeight={600}>{t.checkout.delivery}</Typography>
              </Box>
              <Box sx={{ color: '#2F2B3DB2' }}>
                <Typography>Jamshid Abduarulov</Typography>
                <Typography>Mustaqil olib ketish</Typography>
                <Typography sx={{ mt: '16px' }}>+998 97 701 23 78</Typography>
              </Box>
            </DetailBox>
          </Grid>
        </Grid>
      </Card>

      {/* Items */}
      <Stack sx={{ flexDirection: { xs: 'column', md: 'row' }, gap: '24px', position: 'relative' }}>
        {/* Left side */}
        <Box sx={{ flex: 1 }}>
          <Card variant='outlined' sx={{ boxShadow: 'none' }}>
            {items.map((item, index) => (
              <>
                <Stack
                  key={item.id}
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '24px',
                    position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <Typography>{item.title}</Typography>
                    <Typography>
                      {t.checkout.status.label}: {item.status}
                    </Typography>
                    <Chip
                      label={item.in_stock ? t.checkout.in_stock.yes : t.checkout.in_stock.no}
                      color={item.in_stock ? 'success' : 'error'}
                      skin='light'
                      rounded
                      sx={{ width: 'max-content' }}
                    />
                  </Box>
                  <Typography>
                    <span style={{ color: '#7367F0' }}>${item.new_price}</span>/
                    <span style={{ textDecoration: 'line-through' }}>${item.old_price}</span>
                  </Typography>
                </Stack>
                <Divider sx={{ m: '0 !important' }} />
              </>
            ))}
          </Card>
        </Box>

        {/* Right side */}
        <RightSideBox>
          <Card variant='outlined' sx={{ boxShadow: 'none' }}>
            <PaddingBox sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography fontWeight={600} sx={{ mb: 3 }}>
                {t.checkout.price_reports}
              </Typography>
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
            </PaddingBox>

            <Divider sx={{ margin: '0px !important' }} />

            <PaddingBox>
              <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography fontWeight={600}>{t.checkout.total}</Typography>
                <Typography>$1465.00</Typography>
              </Stack>
            </PaddingBox>
          </Card>
        </RightSideBox>
      </Stack>
    </Stack>
  )
}

export default Confirmation
