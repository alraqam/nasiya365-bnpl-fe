import { Button, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Title from 'src/@core/components/title'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { alpha, Box } from '@mui/system'
import Icon from 'src/@core/components/icon/icon'
import CustomFooter from 'src/@core/components/TableFooter'
import useModal from 'src/@core/store/modal'
import Link from 'next/link'
import { useLang } from 'src/providers/LanguageProvider'
import useFetch from 'src/hooks/useFetch'
import IInvestment from 'src/@core/types/investment'
import usePagination from 'src/hooks/usePagination'

interface Response<T> {
  current_page: string
  per_page: number
  total: number
  last_page: number
  all: number
  data: T
}

const Investments = () => {
  const { t } = useLang()

  const [url, setUrl] = useState('/api/investments')

  const { data, fetchData } = useFetch<Response<IInvestment[]>>(url)
  const { current_page, per_page } = data || {}
  const { paginationModel, setPaginationModel } = usePagination({ current_page, per_page })

  useEffect(() => {
    setUrl(`/api/investments?page=${paginationModel.page + 1}`)
  }, [paginationModel.page])

  const initialColumns: GridColDef[] = [
    { field: 'investor', headerName: t.forms.investments.investor, minWidth: 150, flex: 1 },
    {
      field: 'amount',
      headerName: t.forms.investments.amount,
      minWidth: 120,
      flex: 1,
      renderCell: params =>
        '$' + params.row.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    { field: 'created_at', headerName: t.forms.investments.created_at, minWidth: 180, flex: 1 },
    {
      field: 'actions',
      headerName: t.actions,
      minWidth: 50,
      renderCell: params => {
        const id = params.row.id

        return (
          <Box sx={{ display: 'flex' }}>
            <Link href={`/investment/investments/edit?id=${id}`}>
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
          <Title title={t.pages.investment.investments} />
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

            <Link href='/investment/investments/create'>
              <Button variant='contained' sx={{ gap: 2 }}>
                <Icon svg='/icons/plus.svg' styles={theme => ({ backgroundColor: '#fff' })} />
                {t['add-investment']}
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

      {/* <Dialog open={modal === 'search-investments'} onClose={clearModal}>
        <DialogTitle>
          <Typography variant='h4' align='center'>
            {t.forms.investors.dialog['search-title']}
          </Typography>
          <Typography variant='body2' align='center'>
            {t.forms.investors.dialog['search-desc']}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Form>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.investors.investor}</Typography>
              <CustomTextField
                fullWidth
                placeholder={t.forms.investors.placeholder.investor}
                name='supplier'
                value={filters.supplier}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.investors.passport}</Typography>
              <CustomTextField
                fullWidth
                placeholder={t.forms.investors.placeholder.passport}
                name='imei'
                value={filters.imei}
                onChange={handleChange}
              />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.investors.phone}</Typography>
              <InputMask mask='99 999 99 99'>
                {(inputProps: any) => (
                  <CustomTextField
                    {...inputProps}
                    placeholder={t.forms.investors.placeholder.phone}
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
      </Dialog> */}
    </>
  )
}

export default Investments
