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
import { api } from 'src/configs/api'

interface Response {
  status: boolean
  data: IReminder[]
}

const OrdersReminder = () => {
  const { modal, clearModal, setModal } = useModal()
  const { t } = useLang()

  const [editingId, setEditingId] = useState<null | number>(null)
  const [paymentDate, setPaymentDate] = useState('')
  const [url, setUrl] = useState('/api/orders/notes')

  const { data, fetchData } = useFetch<Response>(url)

  const initialColumns: GridColDef[] = [
    { field: 'NumberOrder', headerName: t.forms.orders.number, minWidth: 120 },
    { field: 'name', headerName: t.forms.orders.client, minWidth: 200 },
    { field: 'phone', headerName: t.forms.client.phone, minWidth: 150 },
    { field: 'model', headerName: t.forms.orders.device, minWidth: 300 },
    { field: 'pay_day', headerName: t.forms.orders['pay-day'], minWidth: 120 },
    {
      field: 'actions',
      headerName: t.actions,
      minWidth: 50,
      renderCell: params => {
        const id = params.row.id

        return (
          <Box sx={{ display: 'flex' }}>
            <Button
              sx={{ padding: '4px', width: 'fit-content', '&:hover': { backgroundColor: 'transparent' } }}
              onClick={() => {
                setModal('edit-payment-date')
                setEditingId(id)
              }}
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

  const handleSavePaymentDate = async () => {
    try {
      const res = await api(`/api/orders/update-monthly/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify({
          comment: paymentDate
        })
      })

      if (res.status) {
        await fetchData()
        clearModal()
      }
    } catch (error) {
      console.log(error)
    }
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
