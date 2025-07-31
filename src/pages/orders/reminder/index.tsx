import {
  Button,
  Stack,
  Chip,
  DialogContent,
  Dialog,
  DialogTitle,
  Typography,
  InputAdornment,
  styled
} from '@mui/material'
import React, { useState } from 'react'
import Title from 'src/@core/components/title'
import clients from 'src/fake-data/clients'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon/icon'
import useManageColumns from 'src/hooks/useManageColumns'
import CustomFooter from 'src/@core/components/TableFooter'
import useModal from 'src/@core/store/modal'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'
import { useLang } from 'src/providers/LanguageProvider'

const Form = styled('form')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',

  [theme.breakpoints.up('sm')]: {
    width: '480px'
  }
}))

const OrdersReminder = () => {
  const { modal, clearModal, setModal } = useModal()
  const { t } = useLang()

  const initialColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', minWidth: 100 },
    { field: 'name', headerName: 'Ismi', minWidth: 250 },
    { field: 'passport', headerName: 'Passport raqami', minWidth: 300 },
    { field: 'address', headerName: 'Manzil', minWidth: 150 },
    { field: 'phone', headerName: 'Telefon raqami', minWidth: 300 },
    {
      field: 'state',
      headerName: 'Holati',
      minWidth: 300,
      renderCell: params => {
        const getStatusColor = (status: string) => {
          switch (status.toLowerCase()) {
            case 'active':
              return 'success'
            case 'inactive':
              return 'error'
            case 'pending':
              return 'warning'
            default:
              return 'default'
          }
        }

        return <Chip label={params.value} color={getStatusColor(params.value)} variant='outlined' size='small' />
      }
    },
    { field: 'gender', headerName: 'Jinsi', minWidth: 300 },
    { field: 'email', headerName: 'Email', minWidth: 300 },
    {
      field: 'actions',
      headerName: 'Harakatlar',
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
            <Button sx={{ padding: '4px', width: 'fit-content', '&:hover': { backgroundColor: 'transparent' } }}>
              <Icon
                svg='/icons/trash.svg'
                width={24}
                height={24}
                styles={theme => ({
                  backgroundColor: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: theme.palette.error.main
                  }
                })}
              />
            </Button>
          </Box>
        )
      }
    }
  ]

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const { visibleColumns, open } = useManageColumns(initialColumns)
  const [filters, setFilters] = useState({
    supplier: '',
    imei: '',
    model: '',
    account: ''
  })
  const [paymentDate, setPaymentDate] = useState('')

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
            columns={visibleColumns}
            rows={clients}
            autoHeight
            sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fff' } }}
            disableColumnMenu
            paginationModel={paginationModel}
            slots={{
              footer: () => (
                <CustomFooter
                  rowCount={clients.length}
                  page={paginationModel.page}
                  pageSize={paginationModel.pageSize}
                  onPageChange={newPage => setPaginationModel(prev => ({ ...prev, page: newPage }))}
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
