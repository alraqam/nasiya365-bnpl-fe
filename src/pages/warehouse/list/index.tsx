import { Button, Stack, Chip, DialogContent, Dialog, DialogTitle, Typography, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Title from 'src/@core/components/title'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { alpha, Box } from '@mui/system'
import Icon from 'src/@core/components/icon/icon'
import CustomFooter from 'src/@core/components/TableFooter'
import useModal from 'src/@core/store/modal'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'
import { useLang } from 'src/providers/LanguageProvider'
import useFetch from 'src/hooks/useFetch'
import IDevice from 'src/@core/types/device'
import IAccessory from 'src/@core/types/accessory'
import Form from 'src/@core/components/DialogForm'
import { useRouter } from 'next/router'
import setParams from 'src/@core/utils/set-params'
import { usePermissions } from 'src/hooks/usePermissions'

interface Response {
  data: IDevice[] | IAccessory[]
}

const initialFilters = {
  provider: '',
  imei: '',
  seria_number: '',
  model: '',
  account: ''
}

const Products = () => {
  const router = useRouter()
  const { modal, clearModal, setModal } = useModal()
  const { t } = useLang()

  const [tab, setTab] = useState<'devices' | 'accessories'>('devices')
  const [filters, setFilters] = useState(initialFilters)
  const [url, setUrl] = useState('/api/products')

  const { hasPermission } = usePermissions()

  const { data, fetchData } = useFetch<Response>(url)
  // const { paginationModel, setPaginationModel } = usePagination({ current_page, per_page })

  useEffect(() => {
    //setUrl(`/api/${tab}`)

    const params = new URLSearchParams(window.location.search)
    params.set('type', tab)
    router.replace(`${window.location.pathname}?${params.toString()}`)
  }, [tab])

  // useEffect(() => {
  //   setUrl(`/api/orders/all-orders?page=${paginationModel.page + 1}`)
  // }, [paginationModel.page])

  const accessoriesColumns: GridColDef[] = [
    { field: 'provider', headerName: t.forms.products.supplier, minWidth: 200, flex: 1 },
    { field: 'model', headerName: t.forms.products.model, minWidth: 300, flex: 1 },
    { field: 'seria_number', headerName: t.forms.products.seria_number, minWidth: 200, flex: 1 },
    { field: 'account', headerName: t.forms.products.account, minWidth: 200, flex: 1 },
    { field: 'quantity', headerName: t.forms.products.quantity, minWidth: 100, flex: 1 },
    { field: 'incoming_price', headerName: t.forms.products.price, minWidth: 150, flex: 1 },
    {
      field: 'actions',
      headerName: t.actions,
      minWidth: 50,
      renderCell: params => {
        const id = params.row.id

        return (
          <Box sx={{ display: 'flex' }}>
            <Link href={`/products/edit?id=${id}`}>
              <Button sx={{ padding: '4px', width: 'fit-content', '&:hover': { backgroundColor: 'transparent' } }}>
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
            </Link>
          </Box>
        )
      }
    }
  ]

  const devicesColumns: GridColDef[] = [
    { field: 'provider', headerName: t.forms.products.supplier, minWidth: 200, flex: 1 },
    { field: 'model', headerName: t.forms.products.model, minWidth: 300, flex: 1 },
    { field: 'imei', headerName: t.forms.products.imei, minWidth: 200, flex: 1 },
    { field: 'account', headerName: t.forms.products.account, minWidth: 250, flex: 1 },
    {
      field: 'id',
      headerName: t.forms.products['box-status'],
      minWidth: 200,
      flex: 1,
      renderCell(params) {
        const withBox = Number(params.row?.order?.box)
        return <Chip color={withBox ? 'success' : 'error'} label={withBox ? t.given : t['not-given']} />
      }
    },
    {
      field: 'status',
      headerName: t.forms.products['sale-type'].label,
      minWidth: 200,
      flex: 1,
      renderCell(params) {
        const isInSale = params.row.order === null
        return (
          <Chip
            color={isInSale ? 'success' : 'warning'}
            label={isInSale ? t.forms.products['sale-type']['in-sale'] : t.forms.products['sale-type'].monthly}
          />
        )
      }
    },
    {
      field: 'actions',
      headerName: t.actions,
      minWidth: 100,
      renderCell: params => {
        const id = params.row.id

        return (
          <Box sx={{ display: 'flex' }}>
            <Link href={`/products/edit?id=${id}`}>
              <Button sx={{ padding: '4px', width: 'fit-content', '&:hover': { backgroundColor: 'transparent' } }}>
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
            </Link>
          </Box>
        )
      }
    }
  ]

  const handleOpenFilter = () => {
    if (tab === 'devices') {
      setModal('search-devices')
    } else if (tab === 'accessories') {
      setModal('search-accessories')
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    })
  }

  const handleSearch = async () => {
    try {
      const params = setParams(filters)
      setUrl(`/api/filter/${tab}?${params}`)
    } catch (error) {
      console.log(error)
    }
  }

  const onCancel = () => {
    setFilters(initialFilters)
    setUrl(`/api/${tab}`)
    clearModal()
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
          <Title title={t.pages.products} />
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
            <Button
              variant='tonal'
              sx={theme => ({
                gap: 2,
                backgroundColor: '#2F2B3D0F',
                color: theme.palette.text.primary,
                '&:hover': { backgroundColor: alpha(theme.palette.grey[300], 0.8) }
              })}
            >
              <Icon svg='/icons/reload.svg' styles={theme => ({ backgroundColor: theme.palette.text.primary })} />
              {t.reload}
            </Button>

            <CustomTextField
              select
              value={tab}
              onChange={e => setTab(e.target.value as 'devices' | 'accessories')}
              defaultValue='devices'
              sx={theme => ({
                gap: 2,
                backgroundColor: '#2F2B3D0F',
                border: 'none',
                borderRadius: '6px',
                color: theme.palette.text.primary,
                '&:hover': { backgroundColor: alpha(theme.palette.grey[300], 0.8), borderColor: 'transparent' },
                '& .MuiInputBase-root': {
                  borderColor: 'transparent',
                  '&:hover': { borderColor: 'transparent !important' }
                }
              })}
            >
              <MenuItem value='devices'>{t.devices}</MenuItem>
              {hasPermission('index', 'AccessoryController') && (
                <MenuItem value='accessories'>{t.accessories}</MenuItem>
              )}
            </CustomTextField>
            <Button
              variant='tonal'
              sx={theme => ({
                gap: 2,
                backgroundColor: '#2F2B3D0F',
                color: theme.palette.text.primary,
                '&:hover': { backgroundColor: alpha(theme.palette.grey[300], 0.8) }
              })}
              onClick={handleOpenFilter}
            >
              <Icon svg='/icons/filter.svg' styles={theme => ({ backgroundColor: theme.palette.text.primary })} />
              {t.filter}
            </Button>
            <Link href='/products/create'>
              <Button variant='contained' sx={{ gap: 2 }}>
                <Icon svg='/icons/plus.svg' styles={theme => ({ backgroundColor: '#fff' })} />
                {t['add-product']}
              </Button>
            </Link>
          </Stack>
        </Stack>

        <Box sx={{ backgroundColor: '#fff', borderRadius: '16px' }}>
          <DataGrid
            columns={tab === 'devices' ? devicesColumns : accessoriesColumns}
            rows={data?.data || []}
            autoHeight
            sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fff' } }}
            disableColumnMenu
            // paginationModel={paginationModel}
            slots={{
              footer: () => (
                <CustomFooter
                  total={1}
                  totalPages={1}
                  page={0}
                  pageSize={1}
                  onPageChange={newPage => console.log('Hello World')}
                />
              )
            }}
          />
        </Box>
      </Stack>

      <Dialog open={modal === 'search-devices'} onClose={clearModal}>
        <DialogTitle>
          <Typography variant='h4' align='center'>
            {t.forms.products.dialog['search-title']}
          </Typography>
          <Typography variant='body2' align='center'>
            {t.forms.products.dialog['search-desc']}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Form>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.products.supplier}</Typography>
              <CustomTextField
                fullWidth
                placeholder='Abdurasul Husanov  A20'
                name='provider'
                value={filters.provider}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.products.imei}</Typography>
              <CustomTextField
                fullWidth
                placeholder='353844107321626'
                name='imei'
                value={filters.imei}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.products.model}</Typography>
              <CustomTextField
                fullWidth
                placeholder='Iphone 14 pro max 256 gb purple'
                name='model'
                value={filters.model}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.products.account}</Typography>
              <CustomTextField
                fullWidth
                placeholder='technomobileuz0029@gmail.com'
                name='account'
                value={filters.account}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' justifyContent='center' gap={4}>
              <Button variant='outlined' type='button' onClick={onCancel}>
                {t.close}
              </Button>
              <Button variant='contained' onClick={handleSearch}>
                {t.search}
              </Button>
            </Box>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={modal === 'search-accessories'} onClose={clearModal}>
        <DialogTitle>
          <Typography variant='h4' align='center'>
            {t.forms.products.dialog['search-accessory']}
          </Typography>
          <Typography variant='body2' align='center'>
            {t.forms.products.dialog['search-desc']}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Form>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.products.supplier}</Typography>
              <CustomTextField
                fullWidth
                placeholder='Abdurasul Husanov  A20'
                name='provider'
                value={filters.provider}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.products.seria_number}</Typography>
              <CustomTextField
                fullWidth
                placeholder='353844107321626'
                name='seria_number'
                value={filters.seria_number}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.products.model}</Typography>
              <CustomTextField
                fullWidth
                placeholder='Iphone 14 pro max 256 gb purple'
                name='model'
                value={filters.model}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.products.account}</Typography>
              <CustomTextField
                fullWidth
                placeholder='technomobileuz0029@gmail.com'
                name='account'
                value={filters.account}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' justifyContent='center' gap={4}>
              <Button variant='outlined' type='button' onClick={onCancel}>
                {t.close}
              </Button>
              <Button variant='contained' onClick={handleSearch}>
                {t.search}
              </Button>
            </Box>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Products
