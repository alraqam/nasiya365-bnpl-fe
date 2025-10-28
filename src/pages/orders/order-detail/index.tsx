import { Icon } from '@iconify/react'
import { Box, Button, Card, Stack, styled, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import Title from 'src/@core/components/title'
import useFetch from 'src/hooks/useFetch'
import { useLang } from 'src/providers/LanguageProvider'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dateToString from 'src/@core/utils/date-to-string'
import formatPhoneNumber from 'src/@core/utils/formatPhone'
import { Response, Payment } from 'src/@core/types/order-details'

const ButtonStyle = {
  boxShadow: 'none',
  backgroundColor: '#2F2B3D0F',
  '&:hover': {
    boxShadow: 'none'
  }
}

const BlockHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 600
}))

const HeaderItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600
}))

const OrderDetail = () => {
  const [payDay, setPayDay] = useState(0)

  const { t } = useLang()
  const router = useRouter()

  const { data, fetchData } = useFetch<Response>('', false)

  useEffect(() => {
    if (router.query.number) {
      fetchData(`/api/orders/show-order/${router.query.number}`)
    }
  }, [router.query, fetchData])

  useEffect(() => {
    setPayDay(data?.data.order.pay_day || 0)
  }, [data])

  const columns: GridColDef[] = [
    { field: 'payment_month', sortable: false, headerName: '#', minWidth: 50, maxWidth: 100, flex: 1 },
    {
      field: 'payments',
      sortable: false,
      headerName: "To'langan summa",
      minWidth: 100,
      flex: 1,
      renderCell(params) {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {params.row.payments.map((payment: Payment, index: number) => (
              <Typography key={payment.id}>{payment.amount}</Typography>
            ))}
          </Box>
        )
      }
    },
    { field: 'rest_summa', sortable: false, headerName: 'Qolgan summa', minWidth: 100, flex: 1 },
    {
      field: 'id',
      sortable: false,
      headerName: "To'langan sana",
      minWidth: 100,
      flex: 1,
      renderCell(params) {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {params.row.payments.map((payment: Payment) => (
              <Typography key={payment.id}>{payment.date}</Typography>
            ))}
          </Box>
        )
      }
    },
    {
      field: 'summa',
      sortable: false,
      headerName: "To'lov sanasi",
      minWidth: 100,
      flex: 1,
      renderCell(params) {
        const month = params.row.month.split('-')[1]
        const year = params.row.month.split('-')[0]
        return (
          <Typography>
            {payDay}-{month}-{year}
          </Typography>
        )
      }
    }
  ]

  return (
    <>
      <Stack sx={{ flexDirection: 'column', gap: 5 }}>
        <Box display='flex' gap={1}>
          <Link href='/orders' style={{ textDecoration: 'none' }}>
            <Title title={t.pages.orders} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
          </Link>
          <Typography variant='h6' color='#7F7F7FE5'>
            /
          </Typography>
          <Title title={t.order} />
        </Box>

        <Card sx={{ px: { md: 12, xs: 4 }, py: { md: 6, xs: 4 }, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Header */}
          <Stack gap={3}>
            <BlockHeader variant='h5' fontWeight={600}>
              {t.order}
            </BlockHeader>
            <Stack sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {/* left */}
              <Box sx={{ display: 'flex', justifyContent: { md: 'start', xs: 'space-between' }, gap: 4, flex: 1 }}>
                <Box sx={{ width: 'max-content', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <HeaderItemTitle>Buyurtma sanasi</HeaderItemTitle>
                  <HeaderItemTitle>Buyurtma raqami</HeaderItemTitle>
                  <HeaderItemTitle>To'lov muddati</HeaderItemTitle>
                  <HeaderItemTitle>To'lov summasi</HeaderItemTitle>
                  <HeaderItemTitle>Izoh</HeaderItemTitle>
                </Box>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: { xs: 'right', md: 'justify' } }}
                >
                  <Typography>
                    {dateToString(data?.data.order.created_at ? new Date(data.data.order.created_at) : new Date(), 'day-month-year', '.')}
                  </Typography>
                  <Typography>{data?.data.order.id}</Typography>
                  <Typography>{data?.data.order.is_cash ? 'Cash' : 'BNPL'}</Typography>
                  <Typography>${data?.data.order.summa}</Typography>
                  <Typography>{data?.data.order.status}</Typography>
                </Box>
              </Box>
              {/* middle */}
              <Box sx={{ display: 'flex', justifyContent: { md: 'center', xs: 'space-between' }, gap: 4, flex: 1 }}>
                <Box sx={{ width: 'max-content', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <HeaderItemTitle>Qurilma</HeaderItemTitle>
                  <HeaderItemTitle>IMEI</HeaderItemTitle>
                  <HeaderItemTitle>Mijoz</HeaderItemTitle>
                </Box>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: { xs: 'right', md: 'justify' } }}
                >
                  <Typography>{data?.data.order.model || 'N/A'}</Typography>
                  <Typography>{'N/A'}</Typography>
                  <Typography>
                    {data?.data.client.first_name} {data?.data.client.last_name}
                  </Typography>
                </Box>
              </Box>
              {/* right */}
              <Box sx={{ display: 'flex', justifyContent: { md: 'end', xs: 'space-between' }, gap: 4, flex: 1 }}>
                <Box sx={{ width: 'max-content', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <HeaderItemTitle>Tannarx</HeaderItemTitle>
                  <HeaderItemTitle>Kafil</HeaderItemTitle>
                  <HeaderItemTitle>Qurilma qutisi</HeaderItemTitle>
                  <HeaderItemTitle>Telefon</HeaderItemTitle>
                </Box>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: { xs: 'right', md: 'justify' } }}
                >
                  <Typography>${data?.data.order.summa.toLocaleString()}</Typography>
                  {/* <Typography>{data?.data.client.bail_name}</Typography> */}
                  <Typography>{data?.data.order.box ? t.given : t['not-given']}</Typography>
                  {data?.data.phone.map(item => (
                    <Typography key={item}>{formatPhoneNumber(item)}</Typography>
                  ))}
                </Box>
              </Box>
            </Stack>
          </Stack>

          {/* Statistics */}
          <Stack
            sx={{
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3
            }}
          >
            <BlockHeader variant='h5' fontWeight={600}>
              Kirim chiqim statistikasi
            </BlockHeader>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                '& > *': {
                  flex: {
                    xs: '1 1 calc(50% - 12px)',
                    sm: '0 0 max-content'
                  }
                }
              }}
            >
              <Button
                variant='contained'
                color='inherit'
                sx={{ ...ButtonStyle }}
                startIcon={<Icon icon='tabler:edit' />}
              >
                Tahrirlash
              </Button>
              <Button
                variant='contained'
                color='inherit'
                sx={{ ...ButtonStyle }}
                startIcon={<Icon icon='tabler:cash' />}
              >
                To'lov
              </Button>
              <Button
                variant='contained'
                color='inherit'
                sx={{ ...ButtonStyle }}
                startIcon={<Icon icon='tabler:file-description' />}
              >
                Yuklash PDF
              </Button>
              <Button
                variant='contained'
                color='error'
                sx={{
                  ...ButtonStyle,
                  backgroundColor: '#FF4C513D',
                  color: '#FF4C51',
                  '&:hover': {
                    backgroundColor: '#ff4c5218',
                    boxShadow: 'none'
                  }
                }}
                startIcon={<Icon icon='tabler:circle-x' />}
              >
                Voz kechilgan
              </Button>
            </Box>
          </Stack>

          {/* Table */}
          <DataGrid
            autoHeight
            columns={columns}
            rows={data?.data.order.monthlies || []}
            hideFooter
            disableColumnMenu
            disableColumnSelector
            disableRowSelectionOnClick
            disableColumnFilter
            sx={{
              borderRadius: '6px !important',
              overflow: 'hidden',
              border: '1px solid #2F2B3D1F',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#fff',
                fontWeight: 'bold'
              },
              '& .MuiDataGrid-columnSeparator': {
                display: 'none'
              }
            }}
          />

          {/* bottom part */}
          <Stack sx={{ flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'space-between', md: 'start' },
                gap: 2,
                flex: 1,
                width: { xs: '100%', md: 'max-content' }
              }}
            >
              <HeaderItemTitle>Boshlang'ich to'lov:</HeaderItemTitle>
              <Typography>${data?.data.order.initial_payment?.toLocaleString()}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'space-between', md: 'center' },
                gap: 2,
                flex: 1,
                width: { xs: '100%', md: 'max-content' }
              }}
            >
              <HeaderItemTitle>Qolgan summa:</HeaderItemTitle>
              <Typography>${data?.data.order.rest_summa?.toLocaleString()}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'space-between', md: 'end' },
                gap: 2,
                flex: 1,
                width: { xs: '100%', md: 'max-content' }
              }}
            >
              <HeaderItemTitle>Jami summa:</HeaderItemTitle>
              <Typography>${data?.data.order.summa.toLocaleString()}</Typography>
            </Box>
          </Stack>
        </Card>
      </Stack>
    </>
  )
}

export default OrderDetail
