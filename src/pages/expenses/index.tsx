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
  MenuItem
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Title from 'src/@core/components/title'
import clients from 'src/fake-data/clients'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon/icon'
import CustomFooter from 'src/@core/components/TableFooter'
import useModal from 'src/@core/store/modal'
import CustomTextField from 'src/@core/components/mui/text-field'
import Link from 'next/link'
import { useLang } from 'src/providers/LanguageProvider'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import Form from 'src/@core/components/DialogForm'
import useFetch from 'src/hooks/useFetch'
import IExpense from 'src/@core/types/expense'
import usePagination from 'src/hooks/usePagination'
import setParams from 'src/@core/utils/set-params'

interface Response<T> {
  current_page: string
  per_page: number
  total: number
  last_page: number
  allSumma: number
  data: T
}

const initialFilters = {
  name: '',
  amount: '',
  type: ''
} as const

const Expenses = () => {
  const { modal, clearModal } = useModal()
  const { t } = useLang()

  const [filters, setFilters] = useState(initialFilters)
  const [url, setUrl] = useState('/api/costs')

  const { data, fetchData } = useFetch<Response<IExpense[]>>(url)
  const { current_page, per_page } = data || {}
  const { paginationModel, setPaginationModel } = usePagination({ current_page, per_page })

  useEffect(() => {
    setUrl(`/api/costs?page=${paginationModel.page + 1}`)
  }, [paginationModel.page])

  const initialColumns: GridColDef[] = [
    { field: 'name', headerName: 'Xarajat', flex: 250 },
    { field: 'type', headerName: 'Turi', flex: 300 },
    { field: 'imei', headerName: 'IMEI', flex: 150 },
    { field: 'model', headerName: 'Model', flex: 300 },
    { field: 'amount', headerName: 'Summa', flex: 300 },
    { field: 'created_at', headerName: 'Sana', flex: 300 },
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
            {/* <Button sx={{ padding: '4px', width: 'fit-content', '&:hover': { backgroundColor: 'transparent' } }}>
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
            </Button> */}
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
    const params = setParams(filters)
    setUrl(`/api/filter/costs?${params}`)
    setPaginationModel({
      page: 0,
      pageSize: 10
    })
    clearModal()
  }

  const onCloseModal = () => {
    clearModal()
    setFilters(initialFilters)

    if (Object.values(filters).some(value => value !== '')) {
      setUrl(`/api/costs?page=${paginationModel.page + 1}`)
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
              {t['total-expense']}:{' '}
              {data?.allSumma?.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) || 0}{' '}
              {t.currency.uzs}
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
            columns={initialColumns}
            rows={data?.data || []}
            autoHeight
            sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fff' } }}
            disableColumnMenu
            paginationModel={paginationModel}
            slots={{
              footer: () => (
                <CustomFooter
                  total={data?.total || 0}
                  totalPages={data?.last_page || 0}
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
              <CustomTextField fullWidth name='amount' value={filters.amount} onChange={handleChange} />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.expenses.type}</Typography>
              <CustomTextField select fullWidth name='type' value={filters.type} onChange={handleChange}>
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
              <Button variant='outlined' type='button' onClick={onCloseModal}>
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

export default Expenses
