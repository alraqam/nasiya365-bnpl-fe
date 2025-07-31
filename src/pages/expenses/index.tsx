import {
  Button,
  Stack,
  Chip,
  DialogContent,
  Dialog,
  DialogTitle,
  Typography,
  InputAdornment,
  Card,
  MenuItem,
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
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'

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
          <Link href={`/expenses/edit?id=${id}`}>
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

const Employees = () => {
  const { modal, clearModal } = useModal()
  const { t } = useLang()

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const { visibleColumns } = useManageColumns(initialColumns)
  const [filters, setFilters] = useState({
    name: '',
    passport: '',
    phone: ''
  })

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
          <Title title={t.pages.expenses} />
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
            <Card
              sx={{
                px: 4,
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                color: '#000 !important',
                backgroundColor: '#2F2B3D0F'
              }}
            >
              {t['total-expense']}: $249 550.00
            </Card>

            <Link href='/expenses/create'>
              <Button variant='contained' sx={{ gap: 2 }}>
                <Icon svg='/icons/plus.svg' styles={theme => ({ backgroundColor: '#fff' })} />
                {t['add-expense']}
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

      <Dialog open={modal === 'search-expenses'} onClose={clearModal}>
        <DialogTitle>
          <Typography variant='h4' align='center'>
            {t.forms.expenses.dialog['search-title']}
          </Typography>
          {/* <Typography variant='body2' align='center'>
            {t.forms.expenses.dialog['search-desc']}
          </Typography> */}
        </DialogTitle>
        <DialogContent>
          <Form>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.expenses.expense}</Typography>
              <CustomTextField fullWidth name='name' value={filters.name} onChange={handleChange} />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.expenses.amount}</Typography>
              <CustomTextField fullWidth name='passport' value={filters.passport} onChange={handleChange} />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.expenses.type}</Typography>
              <CustomTextField select fullWidth>
                <MenuItem value='cost-price'>{t.forms.expenses['cost-price']}</MenuItem>
                <MenuItem value='abandoned'>{t.forms.expenses.abandoned}</MenuItem>
                <MenuItem value='other'>{t.other}</MenuItem>
              </CustomTextField>
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.expenses['date-from']}</Typography>
              <DatePickerWrapper>
                <DatePicker
                  onChange={date => console.log(date)}
                  dateFormat='dd.MM.yyyy'
                  customInput={
                    <CustomTextField
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <Icon svg='/icons/date.svg' color='#2F2B3D' width={20} height={20} />
                          </InputAdornment>
                        )
                      }}
                    />
                  }
                />
              </DatePickerWrapper>
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.expenses['data-to']}</Typography>
              <DatePickerWrapper>
                <DatePicker
                  onChange={date => console.log(date)}
                  dateFormat='dd.MM.yyyy'
                  customInput={
                    <CustomTextField
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <Icon svg='/icons/date.svg' color='#2F2B3D' width={20} height={20} />
                          </InputAdornment>
                        )
                      }}
                    />
                  }
                />
              </DatePickerWrapper>
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

export default Employees
