import {
  Button,
  Stack,
  Chip,
  DialogContent,
  Dialog,
  DialogTitle,
  Typography,
  InputAdornment,
  MenuItem
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Title from 'src/@core/components/title'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { alpha, Box } from '@mui/system'
import Icon from 'src/@core/components/icon/icon'
import CustomFooter from 'src/@core/components/TableFooter'
import useModal from 'src/@core/store/modal'
import CustomTextField from 'src/@core/components/mui/text-field'
import InputMask from 'react-input-mask'
import Link from 'next/link'
import { useLang } from 'src/providers/LanguageProvider'
import useFetch from 'src/hooks/useFetch'
import IEmployee from 'src/@core/types/employee'
import usePagination from 'src/hooks/usePagination'
import Form from 'src/@core/components/DialogForm'
import setParams from 'src/@core/utils/set-params'
import dashToDotFormat from 'src/@core/utils/dash-to-dot-format'
import maskFormat from 'src/@core/utils/mask-format'
import { api } from 'src/configs/api'

interface Response {
  current_page: string
  per_page: number
  total: number
  last_page: number
  data: IEmployee[]
}

const initialFilters = {
  id: '',
  passport: '',
  phone: ''
}

const Employees = () => {
  const { modal, clearModal, setModal} = useModal()
  const { t } = useLang()

  const [filters, setFilters] = useState(initialFilters)
  const [url, setUrl] = useState('/api/admins')

  const { data, fetchData } = useFetch<Response>(url)
  const { current_page, per_page } = data || {}
  const { paginationModel, setPaginationModel } = usePagination({ current_page, per_page })

  useEffect(() => {
    setUrl(`/api/admins?page=${paginationModel.page + 1}`)
  }, [paginationModel.page])

  const initialColumns: GridColDef[] = [
    { field: 'name', headerName: 'F.I.O', minWidth: 200, flex: 1 },
    { field: 'email', headerName: 'Email', minWidth: 200, flex: 1 },
    {
      field: 'phone1',
      headerName: 'Telefon',
      minWidth: 200,
      flex: 1,
      renderCell(params) {
        return <p>+998 {maskFormat(params.row.phone1, '## ### ## ##')}</p>
      }
    },
    {
      field: 'date_of_birth',
      headerName: "Tug'ilgan yili",
      minWidth: 200,
      flex: 1,
      renderCell(params) {
        return <p>{dashToDotFormat(params.row.date_of_birth)}</p>
      }
    },
    { field: 'passport', headerName: 'Pasport', minWidth: 200 },
    {
      field: 'actions',
      headerName: 'Harakatlar',
      minWidth: 200,
      renderCell: params => {
        const id = params.row.id

        return (
          <Box sx={{ display: 'flex' }}>
            <Link href={`/employees/edit?id=${id}`}>
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
            <Button
              sx={{ padding: '4px', width: 'fit-content', '&:hover': { backgroundColor: 'transparent' } }}
              onClick={() => handleDelete(id)}
            >
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    })
  }

  const handleSearch = async () => {
    const params = setParams({ ...filters, phone: filters.phone.replace(/\D/g, '') })
    setUrl(`/api/filter/admins?${params}`)
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
      setUrl(`/api/admins?page=${paginationModel.page + 1}`)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api(`/api/admins/destroy/${id}`, {
        method: 'DELETE'
      })
      await fetchData()
      clearModal()
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
          <Title title={t.pages.employees} />
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
              onClick={() => fetchData()}
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
                                        onClick={() => setModal('search-employees')}
                                      >
                                        <Icon svg='/icons/filter.svg' styles={theme => ({ backgroundColor: theme.palette.text.primary })} />
                                        {t.filter}
                                      </Button>

            <Link href='/employees/create'>
              <Button variant='contained' sx={{ gap: 2 }}>
                <Icon svg='/icons/plus.svg' styles={theme => ({ backgroundColor: '#fff' })} />
                {t['add-employee']}
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

      <Dialog open={modal === 'search-employees'} onClose={clearModal}>
        <DialogTitle>
          <Typography variant='h4' align='center'>
            {t.forms.employees.dialog['search-title']}
          </Typography>
          <Typography variant='body2' align='center'>
            {t.forms.employees.dialog['search-desc']}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Form>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.employees.employee}</Typography>
              <CustomTextField
                select
                fullWidth
                placeholder={t.forms.employees.placeholder.employee}
                name='id'
                value={filters.id}
                onChange={handleChange}
              >
                {data?.data.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.employees.passport}</Typography>
              <CustomTextField
                fullWidth
                placeholder={t.forms.employees.placeholder.pasport}
                name='passport'
                value={filters.passport}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.employees.phone}</Typography>
              <InputMask mask='99 999 99 99' name='phone' value={filters.phone} onChange={handleChange}>
                {(inputProps: any) => (
                  <CustomTextField
                    {...inputProps}
                    placeholder={t.forms.employees.placeholder.phone}
                    variant='outlined'
                    fullWidth
                    sx={{ borderRadius: '8px' }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start' sx={{ marginRight: '4px' }}>
                          +998
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              </InputMask>
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

export default Employees
