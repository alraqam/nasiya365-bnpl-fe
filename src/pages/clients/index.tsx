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
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { alpha, Box } from '@mui/system'
import Icon from 'src/@core/components/icon/icon'
import ManageColumns from 'src/@core/components/ManageColumns'
import useManageColumns from 'src/hooks/useManageColumns'
import CustomFooter from 'src/@core/components/TableFooter'
import useModal from 'src/@core/store/modal'
import CustomTextField from 'src/@core/components/mui/text-field'
import InputMask from 'react-input-mask'
import Link from 'next/link'
import { useLang } from 'src/providers/LanguageProvider'
import useFetch from 'src/hooks/useFetch'
import IClient from 'src/@core/types/client'
import env from 'src/configs/env'
import formatDate from 'src/@core/utils/format-date'
import resolveStatus from 'src/@core/utils/table-utils'
import { api } from 'src/configs/api'
import Form from 'src/@core/components/DialogForm'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

const Clients = () => {
  const { modal, clearModal, setModal } = useModal()
  const { t } = useLang()
  const { data } = useFetch<{ data: IClient[] }>('/api/clients')

  const handleDelete = async (id: number) => {
    const res = await api(`/api/clients/${id}`, {
      method: 'DELETE'
    })

    console.log(res)
  }

  const initialColumns: GridColDef[] = [
    // { field: 'id', headerName: 'ID', flex: 1, minWidth: 10 },
    {
      field: 'name',
      headerName: t.forms.client.name,
      flex: 1,
      minWidth: 250,
      renderCell: params => <p>{params.value + ' ' + params.row.surname + ' ' + params.row.middle_name}</p>
    },
    { field: 'passport', headerName: t.forms.client.passport, flex: 1, minWidth: 150 },
    { field: 'place_of_issue', headerName: t.forms.client.passportIssuer, flex: 1, minWidth: 250 },
    { field: 'date_of_issue', headerName: t.forms.client.passportIssueDate, flex: 1, minWidth: 150 },
    {
      field: 'file_passport',
      headerName: t.forms.client.passortCopy,
      flex: 1,
      minWidth: 150,
      renderCell(params) {
        if (params.value !== 'undefined') {
          return (
            <a href={`${env.baseUrl}/files/${params.value}`} target='_blank'>
              {params.value}
            </a>
          )
        } else {
          return null
        }
      }
    },
    { field: 'date_of_birth', headerName: t.forms.client.birthday, flex: 1, minWidth: 150 },
    {
      field: 'gender',
      headerName: t.forms.client.gender,
      flex: 1,
      minWidth: 200,
      renderCell: params => {
        switch (params.value) {
          case 1:
            return <Chip label={t.male} color='success' variant='outlined' size='small' />
          case 0:
            return <Chip label={t.female} color='error' variant='outlined' size='small' />
        }
      }
    },
    { field: 'place_of_birth', headerName: t.forms.client.birthPlace, flex: 1, minWidth: 200 },
    { field: 'place_of_registration', headerName: t.forms.client.registeredAddress, flex: 1, minWidth: 200 },
    { field: 'place_of_residence', headerName: t.forms.client.address, flex: 1, minWidth: 300 },
    { field: 'workplace', headerName: t.forms.client.workplace, flex: 1, minWidth: 150 },
    { field: 'specialization', headerName: t.forms.client.profession, flex: 1, minWidth: 100 },
    { field: 'phones', headerName: t.forms.client.phone, flex: 1, minWidth: 150 },
    { field: 'email', headerName: t.forms.client.email, flex: 1, minWidth: 150 },
    {
      field: 'file',
      headerName: t.forms.client.application,
      flex: 1,
      minWidth: 200,
      renderCell(params) {
        if (params.value === 'undefined') {
          return null
        }
      }
    },
    { field: 'bail_name', headerName: t.forms.client.guarantor, flex: 1, minWidth: 150 },
    { field: 'bail_phone', headerName: t.forms.client['guarantor-phone'], flex: 1, minWidth: 150 },
    { field: 'guarantor', headerName: t.forms.client.guarantor, flex: 1, minWidth: 200 },
    { field: 'passport_status', headerName: t.forms.client.status, flex: 1, minWidth: 50 },
    {
      field: 'file_url',
      headerName: t.forms.client['file-url'],
      flex: 1,
      minWidth: 150,
      renderCell(params) {
        if (params.value && params.value.split('/files/')[1] === 'undefined') {
          return null
        } else {
          return (
            <a href={params.value} target='_blank'>
              Ko'rish
            </a>
          )
        }
      }
    },
    {
      field: 'file_passport_url',
      headerName: t.forms.client['passport-url'],
      flex: 1,
      minWidth: 150,
      renderCell(params) {
        if (params.value && params.value.split('/files/')[1] === 'undefined') {
          return null
        } else {
          return (
            <a href={params.value} target='_blank'>
              Ko'rish
            </a>
          )
        }
      }
    },
    {
      field: 'created_at',
      headerName: t.forms.client['created-at'],
      flex: 1,
      minWidth: 150,
      renderCell: params => {
        return formatDate(params.value)
      }
    },
    {
      field: 'updated_at',
      headerName: t.forms.client['updated-at'],
      flex: 1,
      minWidth: 150,
      renderCell: params => {
        return formatDate(params.value)
      }
    },
    { field: 'phone', headerName: t.forms.client.phone, flex: 1, minWidth: 150 },
    {
      field: 'status',
      headerName: t.forms.client.status,
      minWidth: 200,
      renderCell: params => {
        const res = resolveStatus(params.value) as {
          color: 'success' | 'error' | 'warning'
          label: string
        }

        return <Chip label={res.label} color={res.color} variant='outlined' size='small' />
      }
    },
    {
      field: 'actions',
      headerName: t.actions,
      minWidth: 200,
      renderCell: params => {
        const id = params.row.id

        return (
          <Box sx={{ display: 'flex' }}>
            <Link href={`/clients/edit?id=${id}`}>
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

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const {
    anchorEl,
    handleSetAnchorEl,
    handleCloseAnchorEl,
    handleColumnToggle,
    columnVisibility,
    visibleColumns,
    open
  } = useManageColumns(initialColumns)
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
          {/* Left side */}
          <Title title={t.pages.clients} />

          {/* Right side */}
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
              onClick={handleSetAnchorEl}
              aria-controls={open ? 'column-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
            >
              {t['manage-columns']}
              <Icon svg='/icons/chevron-down.svg' styles={theme => ({ backgroundColor: theme.palette.text.primary })} />
            </Button>
            <ManageColumns
              columnVisibility={columnVisibility}
              handleColumnToggle={handleColumnToggle}
              anchorEl={anchorEl}
              open={open}
              handleCloseAnchorEl={handleCloseAnchorEl}
              initialColumns={initialColumns}
            />
            <Button
              variant='tonal'
              sx={theme => ({
                gap: 2,
                backgroundColor: '#2F2B3D0F',
                color: theme.palette.text.primary,
                '&:hover': { backgroundColor: alpha(theme.palette.grey[300], 0.8) }
              })}
              onClick={() => setModal('search-clients')}
            >
              <Icon svg='/icons/filter.svg' styles={theme => ({ backgroundColor: theme.palette.text.primary })} />
              {t.filter}
            </Button>
            <Link href='/clients/create'>
              <Button variant='contained' sx={{ gap: 2 }}>
                <Icon svg='/icons/plus.svg' styles={theme => ({ backgroundColor: '#fff' })} />
                {t['add-client']}
              </Button>
            </Link>
          </Stack>
        </Stack>

        <Box sx={{ backgroundColor: '#fff', borderRadius: '16px' }}>
          <DataGrid
            columns={visibleColumns}
            rows={data?.data || []}
            autoHeight
            sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fff' } }}
            disableColumnMenu
            paginationModel={paginationModel}
            slots={{
              footer: () => (
                <CustomFooter
                  total={10}
                  totalPages={10}
                  page={paginationModel.page}
                  pageSize={paginationModel.pageSize}
                  onPageChange={newPage => setPaginationModel(prev => ({ ...prev, page: newPage }))}
                />
              )
            }}
          />
        </Box>
      </Stack>

      <Dialog open={modal === 'search-clients'} onClose={clearModal}>
        <DialogTitle>
          <Typography variant='h4' align='center'>
            {t.forms.client.dialog['search-title']}
          </Typography>
          <Typography variant='body2' align='center'>
            {t.forms.client.dialog['search-desc']}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Form>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.client.client}</Typography>
              <CustomAutocomplete
                placeholder={t.forms.client.name}
                freeSolo
                options={data?.data ?? []}
                getOptionLabel={option => (typeof option === 'string' ? option : option.name ?? '')}
                renderInput={params => <CustomTextField {...params} />}
                isOptionEqualToValue={(option, value) =>
                  typeof option !== 'string' && typeof value !== 'string' && option.id === value.id
                }
                renderOption={(props, option) => (
                  <li {...props} key={typeof option === 'string' ? option : option.id}>
                    {typeof option === 'string' ? option : option.name}
                  </li>
                )}
                onChange={(event, value) => {
                  setFilters({
                    ...filters,
                    name: typeof value === 'string' ? value : value?.name ?? ''
                  })
                }}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.client.passport}</Typography>
              <CustomTextField
                fullWidth
                placeholder={t.forms.client.passportSeries}
                name='passport'
                value={filters.passport}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.client.phone}</Typography>
              <InputMask mask='99 999 99 99' name='phone' value={filters.phone} onChange={handleChange}>
                {(inputProps: any) => (
                  <CustomTextField
                    {...inputProps}
                    placeholder='00 000 00 00'
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

export default Clients
