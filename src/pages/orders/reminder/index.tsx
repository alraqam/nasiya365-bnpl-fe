import { Button, Stack, Chip, DialogContent, Dialog, DialogTitle, Typography } from '@mui/material'
import React, { useState } from 'react'
import Title from 'src/@core/components/title'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon/icon'
import useModal from 'src/@core/store/modal'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'
import { useLang } from 'src/providers/LanguageProvider'
import useFetch from 'src/hooks/useFetch'
import IReminder from 'src/@core/types/order-reminder'
import Form from 'src/@core/components/DialogForm'
import CustomFooter from 'src/@core/components/TableFooter'

interface Response {
  status: boolean
  data: IReminder[]
}

const initialFilters = {
  supplier: '',
  imei: '',
  model: '',
  account: ''
}

const OrdersReminder = () => {
  const { modal, clearModal, setModal } = useModal()
  const { t } = useLang()

  const [filters, setFilters] = useState(initialFilters)
  const [paymentDate, setPaymentDate] = useState('')
  const [url, setUrl] = useState('/api/orders/notes')

  const { data, fetchData } = useFetch<Response>(url)

  const initialColumns: GridColDef[] = [
    { field: 'NumberOrder', headerName: 'Buyurtma raqami', flex: 1 },
    { field: 'name', headerName: 'Mijoz F.I.O', flex: 1 },
    { field: 'phone', headerName: 'Telefon', flex: 1 },
    { field: 'model', headerName: 'Qurilma', flex: 1 },
    { field: 'pay_day', headerName: "To'lov kuni", flex: 1 },
    {
      field: 'actions',
      headerName: t.actions,
      minWidth: 200,
      renderCell: params => {
        const id = params.row.id

        return (
          <Box sx={{ display: 'flex' }}>
            <Button
              sx={{ padding: '4px', width: 'fit-content', '&:hover': { backgroundColor: 'transparent' } }}
              onClick={() => setModal('edit-payment-date')}
            >
              <Icon
                svg='/icons/edit.svg'
                width={24}
                height={24}
                styles={theme => ({
                  backgroundColor: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: theme.palette.warning.main
                  }
                })}
              />
            </Button>
          </Box>
        )
      }
    }
  ]

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    })
  }

  const handleSearch = async () => {
    console.log(filters)
    // Backend interaction goes here
  }

  const handleSavePaymentDate = () => {
    console.log(paymentDate)
    // Backend interaction goes here
  }

  return (
    <>
      <Stack gap={4}>
        <Stack
          sx={theme => ({
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2
          })}
        >
          <Box display='flex' gap={1}>
            <Link href='/orders' style={{ textDecoration: 'none' }}>
              <Title title={t.pages.orders} sx={{ color: '#7F7F7FE5' }} color='#7F7F7FE5' />
            </Link>
            <Typography variant='h6' color='#7F7F7FE5'>
              /
            </Typography>
            <Title title={t.reminder} />
          </Box>
        </Stack>

        <Box sx={{ backgroundColor: '#fff', borderRadius: '16px' }}>
          <DataGrid
            columns={initialColumns}
            rows={data?.data || []}
            autoHeight
            sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fff' } }}
            disableColumnMenu
            slots={{
              footer: () => (
                <CustomFooter
                  total={1}
                  totalPages={1}
                  page={1}
                  pageSize={1}
                  onPageChange={newPage => console.log('changed')}
                />
              )
            }}
          />
        </Box>
      </Stack>

      <Dialog open={modal === 'edit-payment-date'} onClose={clearModal}>
        <DialogTitle>
          <Typography variant='h4' align='center'>
            {t.forms.orders.dialog['change-payment-date-title']}
          </Typography>
          <Typography variant='body2' align='center'>
            {t.forms.orders.dialog['change-payment-date-desc']}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Form>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.orders.payment_date}</Typography>
              <CustomTextField
                fullWidth
                name='paymentDate'
                value={paymentDate}
                onChange={e => setPaymentDate(e.target.value)}
              />
            </Box>
            <Box display='flex' justifyContent='center' gap={4}>
              <Button
                variant='outlined'
                type='button'
                onClick={() => {
                  clearModal()
                  setPaymentDate('')
                }}
              >
                {t.forms.cancel}
              </Button>
              <Button variant='contained' onClick={handleSavePaymentDate}>
                {t.forms.submit}
              </Button>
            </Box>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default OrdersReminder
