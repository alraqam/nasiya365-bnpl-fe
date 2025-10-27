import { Button, Stack, Chip, DialogContent, Dialog, DialogTitle, Typography, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import Title from 'src/@core/components/title'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { alpha, Box } from '@mui/system'
import Icon from 'src/@core/components/icon/icon'
import CustomFooter from 'src/@core/components/TableFooter'
import useModal from 'src/@core/store/modal'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'
import { useLang } from 'src/providers/LanguageProvider'
import Form from 'src/@core/components/DialogForm'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import { useOrders } from 'src/hooks/api'

const initialFilters = {
  status: '',
  order: '',
  client: '',
  imei: '',
  payment_deadline: ''
}

const Orders = () => {
  const { modal, clearModal, setModal } = useModal()
  const { t } = useLang()

  const [filters, setFilters] = useState(initialFilters)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  
  const { orders, loading, refetch, meta } = useOrders({ 
    page: paginationModel.page + 1, // API uses 1-based indexing, DataGrid uses 0-based
    per_page: paginationModel.pageSize 
  })

  const initialColumns: GridColDef[] = [
    { field: 'status', headerName: t.forms.orders.status, minWidth: 100, flex: 1 },
    {
      field: 'NumberOrder',
      headerName: t.forms.orders.number,
      minWidth: 100,
      flex: 1,
      renderCell(params) {
        return <Link href={`/orders/order-detail?number=${params.row.id}`}>{params.value}</Link>
      }
    },
    { field: 'client_name', headerName: t.forms.orders.client, minWidth: 200, flex: 1 },
    { field: 'model', headerName: t.forms.orders.model, minWidth: 300, flex: 1 },
    { field: 'pay_type', headerName: t.forms.orders.payment_deadline, minWidth: 100, flex: 1 },
    { field: 'summa', headerName: t.forms.orders.total_price, minWidth: 100, flex: 1 },
    { field: 'rest_summa', headerName: t.forms.orders.price, minWidth: 100, flex: 1 },
    { field: 'notes', headerName: t.forms.orders.comment, minWidth: 300, flex: 1 },
    { field: 'pay_day', headerName: t.forms.orders.payment_date, minWidth: 100, flex: 1 },
    { field: 'created_at', headerName: t.forms.orders.created_at, minWidth: 200, flex: 1 }
  ]

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    })
  }

  const handleSearch = async () => {
    // TODO: Implement search functionality with filters
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
          <Title title={t.pages.orders} />
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 3,
              marginLeft: 'auto',
              flexWrap: 'wrap'
            }}
          >
            <Link href='/orders/reminder'>
              <Button
                variant='tonal'
                sx={theme => ({
                  gap: 2,
                  backgroundColor: '#2F2B3D0F',
                  color: theme.palette.text.primary,
                  '&:hover': { backgroundColor: alpha(theme.palette.grey[300], 0.8) }
                })}
              >
                <Icon svg='/icons/bell.svg' styles={theme => ({ backgroundColor: theme.palette.text.primary })} />
                {t.reminder}
              </Button>
            </Link>

            <Button
              variant='tonal'
              sx={theme => ({
                gap: 2,
                backgroundColor: '#2F2B3D0F',
                color: theme.palette.text.primary,
                '&:hover': { backgroundColor: alpha(theme.palette.grey[300], 0.8) }
              })}
              onClick={() => refetch()}
            >
              <Icon svg='/icons/reload.svg' styles={theme => ({ backgroundColor: theme.palette.text.primary })} />
              {t.reload}
            </Button>
            <Button
              variant='tonal'
              sx={theme => ({
                gap: 2,
                backgroundColor: '#2F2B3D0F',
                color: theme.palette.text.primary,
                '&:hover': { backgroundColor: alpha(theme.palette.grey[300], 0.8) }
              })}
              onClick={() => setModal('search-orders')}
            >
              <Icon svg='/icons/filter.svg' styles={theme => ({ backgroundColor: theme.palette.text.primary })} />
              {t.filter}
            </Button>
            <Link href='/orders/create'>
              <Button variant='contained' sx={{ gap: 2 }}>
                <Icon svg='/icons/plus.svg' styles={theme => ({ backgroundColor: '#fff' })} />
                {t['add-order']}
              </Button>
            </Link>
          </Stack>
        </Stack>

        <Box sx={{ backgroundColor: '#fff', borderRadius: '16px' }}>
          <DataGrid
            columns={initialColumns}
            rows={orders || []}
            autoHeight
            sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fff' } }}
            disableColumnMenu
            paginationModel={paginationModel}
            slots={{
              footer: () => (
                <CustomFooter
                  total={meta?.total || 0}
                  totalPages={meta?.last_page || 1}
                  page={paginationModel.page}
                  pageSize={paginationModel.pageSize}
                  onPageChange={newPage => setPaginationModel(prev => ({ ...prev, page: newPage }))}
                />
              )
            }}
            loading={loading}
          />
        </Box>
      </Stack>

      <Dialog open={modal === 'search-orders'} onClose={clearModal}>
        <DialogTitle>
          <Typography variant='h4' align='center'>
            {t.forms.orders.dialog['search-title']}
          </Typography>
          <Typography variant='body2' align='center'>
            {t.forms.orders.dialog['search-desc']}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Form>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.orders.status}</Typography>
              <CustomTextField select fullWidth name='status' value={filters.status} onChange={handleChange}>
                <MenuItem value='active'>{t.active}</MenuItem>
                <MenuItem value='inactive'>{t.inactive}</MenuItem>
              </CustomTextField>
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.orders.order}</Typography>
              <CustomTextField
                fullWidth
                placeholder={t.forms.orders.placeholder.order}
                name='order'
                value={filters.order}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.orders.client}</Typography>
              <CustomAutocomplete
                placeholder={t.forms.client.name}
                freeSolo
                options={orders ?? []}
                getOptionLabel={option => (typeof option === 'string' ? option : option.client_name ?? '')}
                renderInput={params => <CustomTextField {...params} />}
                isOptionEqualToValue={(option, value) =>
                  typeof option !== 'string' && typeof value !== 'string' && option.id === value.id
                }
                renderOption={(props, option) => (
                  <li {...props} key={typeof option === 'string' ? option : option.id}>
                    {typeof option === 'string' ? option : option.client_name}
                  </li>
                )}
                onChange={(event, value) => {
                  setFilters({
                    ...filters,
                    client: typeof value === 'string' ? value : value?.client_name ?? ''
                  })
                }}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.orders.payment_deadline}</Typography>
              <CustomTextField
                fullWidth
                placeholder={t.forms.orders.placeholder.payment_deadline}
                name='payment_deadline'
                value={filters.payment_deadline}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' justifyContent='center' gap={4}>
              <Button variant='outlined' type='button' onClick={clearModal}>
                {t.forms.cancel}
              </Button>
              <Button variant='contained' onClick={handleSearch}>
                {t.forms.submit}
              </Button>
            </Box>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Orders
