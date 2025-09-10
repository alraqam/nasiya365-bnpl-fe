import { Icon } from '@iconify/react'
import { Box, Button, Card, Stack, styled, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Link from 'next/link'
import Title from 'src/@core/components/title'
import useFetch from 'src/hooks/useFetch'
import { useLang } from 'src/providers/LanguageProvider'
import { Payment, Response } from './types'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dateToString from 'src/@core/utils/date-to-string'
import { formatDate } from 'src/@core/utils/format'
import formatPhoneNumber from 'src/@core/utils/formatPhone'

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
  }, [router.query])

  useEffect(() => {
    setPayDay(data?.data.order.pay_day || 0)
  }, [data])

  const columns: GridColDef[] = [
    { field: 'payment_month', sortable: false, headerName: '#', maxWidth: 60, flex: 1 },
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

        <Card sx={{ px: 12, py: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Header */}
          <Stack gap={3}>
            <BlockHeader variant='h5' fontWeight={600}>
              {t.order}
            </BlockHeader>
            <Stack sx={{ flexDirection: 'row' }}>
              {/* left */}
              <Box sx={{ display: 'flex', justifyContent: 'start', gap: 4, flex: 1 }}>
                <Box sx={{ width: 'max-content', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <HeaderItemTitle>Buyurtma sanasi</HeaderItemTitle>
                  <HeaderItemTitle>Buyurtma raqami</HeaderItemTitle>
                  <HeaderItemTitle>To'lov muddati</HeaderItemTitle>
                  <HeaderItemTitle>To'lov summasi</HeaderItemTitle>
                  <HeaderItemTitle>Izoh</HeaderItemTitle>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography>
                    {dateToString(data?.data.order.startDate || new Date(), 'day-month-year', '.')}
                  </Typography>
                  <Typography>{data?.data.order.NumberOrder}</Typography>
                  <Typography>{data?.data.order.pay_type}</Typography>
                  <Typography>${data?.data.order.rest_summa}</Typography>
                  <Typography>{data?.data.order.notes}</Typography>
                </Box>
              </Box>
              {/* middle */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flex: 1 }}>
                <Box sx={{ width: 'max-content', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <HeaderItemTitle>Qurilma</HeaderItemTitle>
                  <HeaderItemTitle>IMEI</HeaderItemTitle>
                  <HeaderItemTitle>Mijoz</HeaderItemTitle>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography>{data?.data.device.model}</Typography>
                  <Typography>{data?.data.device.imei}</Typography>
                  <Typography>
                    {data?.data.client.name} {data?.data.client.surname}
                  </Typography>
                </Box>
              </Box>
              {/* right */}
              <Box sx={{ display: 'flex', justifyContent: 'end', gap: 4, flex: 1 }}>
                <Box sx={{ width: 'max-content', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <HeaderItemTitle>Tannarx</HeaderItemTitle>
                  <HeaderItemTitle>Kafil</HeaderItemTitle>
                  <HeaderItemTitle>Qurilma qutisi</HeaderItemTitle>
                  <HeaderItemTitle>Telefon</HeaderItemTitle>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography>${data?.data.order.body_price.toLocaleString()}</Typography>
                  <Typography>{data?.data.client.bail_name}</Typography>
                  <Typography>{data?.data.order.box ? t.given : t['not-given']}</Typography>
                  {data?.data.phone.map(item => (
                    <Typography>{formatPhoneNumber(item)}</Typography>
                  ))}
                </Box>
              </Box>
            </Stack>
          </Stack>

          {/* Statistics */}
          <Stack sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <BlockHeader variant='h5' fontWeight={600}>
              Kirim chiqim statistikasi
            </BlockHeader>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Button variant='contained' color='inherit' sx={ButtonStyle} startIcon={<Icon icon='tabler:edit' />}>
                Tahrirlash
              </Button>
              <Button variant='contained' color='inherit' sx={ButtonStyle} startIcon={<Icon icon='tabler:cash' />}>
                To'lov
              </Button>
              <Button
                variant='contained'
                color='inherit'
                sx={ButtonStyle}
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
                  '&:hover': { backgroundColor: '#ff4c5218', boxShadow: 'none' }
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
          <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: 2, flex: 1 }}>
              <HeaderItemTitle>Boshlang'ich to'lov:</HeaderItemTitle>
              <Typography>${data?.data.order.initial_payment.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flex: 1 }}>
              <HeaderItemTitle>Qolgan summa:</HeaderItemTitle>
              <Typography>${data?.data.order.rest_summa.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: 2, flex: 1 }}>
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
