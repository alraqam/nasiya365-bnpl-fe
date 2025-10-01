import { Icon } from '@iconify/react'
import { Box, Button, Card, Divider, IconButton, Stack, Typography } from '@mui/material'
import { useLang } from 'src/providers/LanguageProvider'
import { PaddingBox, RightSideBox, StepChildrenProps, Wrapper } from '.'
import Chip from 'src/@core/components/mui/chip'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useState } from 'react'
import useDebouncedFetch from 'src/hooks/useDebouncedFetch'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

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

const Basket = ({ setStep }: StepChildrenProps) => {
  const { t } = useLang()

  const [basket, setBasket] = useState(items)
  const [search, setSearch] = useState('')

  const { data, fetchData } = useDebouncedFetch<{ id: number; model: string; provider: string; price: number }[]>(
    `http://localhost:4000/products?model_like=${search}`,
    {
      auto: false,
      withBaseURL: false,
      delay: 700
    }
  )

  const handleSubmit = async () => {
    setStep(2)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleRemoveItem = (id: number) => {
    setBasket(basket.filter(item => item.id !== id))
  }

  return (
    <Wrapper>
      {/* Left side */}
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: 4
          }}
        >
          <Typography fontWeight={600}>{t.checkout['add-to-basket']}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CustomAutocomplete
              placeholder='Iphone 14 pro max'
              freeSolo
              fullWidth
              options={data ?? []}
              getOptionLabel={option => (typeof option === 'string' ? option : option.model ?? '')}
              inputValue={search}
              onInputChange={(event, newInputValue) => {
                setSearch(newInputValue)
                fetchData()
              }}
              onChange={(event, value) => {
                if (value && typeof value !== 'string') {
                  setSearch('')
                  setBasket(prev => {
                    if (prev.find(item => item.id === value.id)) return prev as any
                    return [...prev, value]
                  })
                }
              }}
              renderInput={params => <CustomTextField {...params} />}
            />
            <Button variant='contained'>{t.add}</Button>
          </Box>
        </Box>

        <Typography fontWeight={600} sx={{ mb: '16px' }}>
          {t.checkout.basket.replace('?', `${basket.length}`)}
        </Typography>
        <Card variant='outlined' sx={{ boxShadow: 'none' }}>
          {/* Basket empty */}
          {basket.length <= 0 && (
            <Box
              sx={{
                height: '168px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography>{t.checkout.basket_empty}</Typography>
            </Box>
          )}

          {/* Render the items */}
          {basket.map((item, index) => (
            <>
              <Stack
                key={item.id}
                sx={{ flexDirection: 'row', alignItems: 'center', gap: '16px', padding: '24px', position: 'relative' }}
              >
                <Box
                  sx={{
                    width: { xs: '120px', md: '120px' },
                    aspectRatio: '1/1',
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
                  <Typography>
                    <span style={{ color: 'red' }}>${item.new_price}</span>/
                    <span style={{ textDecoration: 'line-through' }}>${item.old_price}</span>
                  </Typography>
                </Box>
                <IconButton sx={{ mb: 'auto' }} onClick={() => handleRemoveItem(item.id)}>
                  <Icon icon='tabler:x' />
                </IconButton>
              </Stack>
              <Divider sx={{ m: '0 !important' }} />
            </>
          ))}
        </Card>
      </Box>

      {/* Right side */}
      <RightSideBox>
        <Card variant='outlined' sx={{ boxShadow: 'none' }}>
          <PaddingBox>
            <Typography fontWeight={600}>{t.checkout.price_reports}</Typography>
          </PaddingBox>

          <Divider sx={{ margin: '0px !important' }} />

          <PaddingBox sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                <Chip skin='light' rounded color='success' label={t.checkout.free} />
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
          {t.checkout.cta}
        </Button>
      </RightSideBox>
    </Wrapper>
  )
}

export default Basket
