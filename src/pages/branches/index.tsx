import {
  Button,
  Stack,
  DialogContent,
  Dialog,
  DialogTitle,
  Typography,
  InputAdornment,
  Card,
  MenuItem
} from '@mui/material'
import React, { useState } from 'react'
import Title from 'src/@core/components/title'
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

interface Response {
  id: number
  location: string
  phone: string
  address: string
  manager: string
  is_main: number
  created_at: string
  updated_at: string
}

const initialFilters = {
  name: '',
  amount: '',
  type: ''
} as const

const Branches = () => {
  const { modal, clearModal } = useModal()
  const { t } = useLang()

  const [filters, setFilters] = useState(initialFilters)

  const { data } = useFetch<Response[]>('/api/branches')

  const initialColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', minWidth: 50, flex: 1 },
    { field: 'location', headerName: 'Lokatsiya', minWidth: 150, flex: 1 },
    { field: 'address', headerName: 'Adres', minWidth: 250, flex: 1 },
    { field: 'phone', headerName: 'Telefon', minWidth: 100, flex: 1 },
    { field: 'manager', headerName: 'Menejer', minWidth: 150, flex: 1 },
    { field: 'created_at', headerName: 'Kiritilgan vaqti', minWidth: 150, flex: 1 },
    {
      field: 'actions',
      headerName: 'Harakatlar',
      minWidth: 150,
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    })
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
          <Title title={t.pages.branches} />
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
            <Link href='/expenses/create'>
              <Button variant='contained' sx={{ gap: 2 }}>
                <Icon svg='/icons/plus.svg' styles={theme => ({ backgroundColor: '#fff' })} />
                {t['add-branch']}
              </Button>
            </Link>
          </Stack>
        </Stack>

        <Box sx={{ backgroundColor: '#fff', borderRadius: '16px' }}>
          <DataGrid
            columns={initialColumns}
            rows={data || []}
            autoHeight
            sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fff' } }}
            disableColumnMenu
            hideFooter
            // slots={{
            //   footer: () => (
            //     <CustomFooter
            //       total={data?.total || 0}
            //       totalPages={data?.last_page || 0}
            //       page={paginationModel.page}
            //       pageSize={paginationModel.pageSize}
            //       onPageChange={newPage => setPaginationModel(prev => ({ ...prev, page: newPage }))}
            //     />
            //   )
            // }}
          />
        </Box>
      </Stack>
    </>
  )
}

export default Branches
