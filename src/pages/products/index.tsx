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
import { alpha, Box } from '@mui/system'
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

const Products = () => {
  const { modal, clearModal } = useModal()
  const { t } = useLang()

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    })
  }

  const handleSearch = async () => {
    console.log(filters)

    // backend interaction goes here
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

            <Button
              variant='tonal'
              sx={theme => ({
                gap: 2,
                backgroundColor: '#2F2B3D0F',
                color: theme.palette.text.primary,
                '&:hover': { backgroundColor: alpha(theme.palette.grey[300], 0.8) }
              })}
              aria-controls={open ? 'column-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
            >
              {t.devices}
              <Icon svg='/icons/chevron-down.svg' styles={theme => ({ backgroundColor: theme.palette.text.primary })} />
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

      <Dialog open={modal === 'search-products'} onClose={clearModal}>
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
                name='supplier'
                value={filters.supplier}
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
              <Button variant='outlined' type='button' onClick={clearModal}>
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
