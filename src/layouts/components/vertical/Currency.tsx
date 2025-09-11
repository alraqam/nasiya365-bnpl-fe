import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  IconButtonProps,
  InputAdornment,
  Stack,
  styled,
  Theme,
  Typography
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomFooter from 'src/@core/components/TableFooter'
import useModal from 'src/@core/store/modal'
import useFetch from 'src/hooks/useFetch'
import { useLang } from 'src/providers/LanguageProvider'

type Response = {
  currency: string
  created_at: string
}[]

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: '10px',
  right: '-10px',
  color: '#2F2B3DE5',
  position: 'absolute',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`
}))

const initialForm = {
  course: ''
}

const Currency = () => {
  const { setModal, modal, clearModal } = useModal()
  const { t } = useLang()

  const [form, setForm] = useState(initialForm)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [hasSent, setHasSent] = useState(false)

  const { data } = useFetch<Response>('http://localhost:4000/currency', true, false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async () => {
    setHasSent(true)
    setTimeout(() => {
      setHasSent(false)
    }, 3000)
  }

  const initialColumns: GridColDef[] = [
    { field: 'created_at', headerName: t.forms.dashboard.currency.form.created_at, flex: 1 },
    {
      field: 'currency',
      headerName: t.forms.dashboard.currency.form.currency,
      flex: 1,
      headerAlign: 'right',
      align: 'right'
    }
  ]

  return (
    <>
      <Card
        sx={{
          background: '#80839029',
          paddingY: '6px',
          paddingX: '12px',
          color: '#808390',
          cursor: 'pointer'
        }}
        onClick={() => setModal('set-currency-modal')}
      >
        $ 12500
      </Card>

      <Dialog
        open={modal === 'set-currency-modal'}
        onClose={clearModal}
        PaperProps={{
          sx: { width: 'max-content', maxWidth: '100%', paddingTop: '0px !important' }
        }}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          <Typography variant='h4' align='center'>
            {t.forms.dashboard.currency.dialog.title}
          </Typography>
          <Typography variant='body2' align='center'>
            {t.forms.dashboard.currency.dialog.desc}
          </Typography>
          <CustomCloseButton aria-label='close' onClick={clearModal}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <Divider sx={{ width: '100%', marginTop: '16px' }} />
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', paddingY: '0px !important', paddingX: '12px !important' }}
        >
          <Stack
            sx={theme => ({
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              paddingTop: '20px',
              gap: '20px'
            })}
          >
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'end',
                alignItems: 'end',
                gap: '12px',
                minWidth: { xs: '100%', sm: '472px' }
              }}
            >
              <Box display='flex' flexDirection='column' gap={1} sx={{ flex: 1 }}>
                <Typography>{t.forms.dashboard.currency.form.label}</Typography>
                <CustomTextField
                  placeholder='0'
                  fullWidth
                  InputProps={{
                    sx: {
                      paddingRight: '0px !important'
                    },
                    startAdornment: (
                      <InputAdornment position='start' sx={{ marginRight: '4px' }}>
                        $
                      </InputAdornment>
                    )
                  }}
                  name='price'
                  value={form.course || null}
                  onChange={handleChange}
                />
              </Box>
              <Button
                sx={{
                  paddingX: '20px',
                  boxShadow: 'none',
                  backgroundColor: hasSent ? '#28C76F3D' : '#FF9F433D',
                  '&:hover': { backgroundColor: hasSent ? '#28C76F3D' : '#FF9F433D', boxShadow: 'none' }
                }}
                variant={'contained'}
                onClick={handleSubmit}
              >
                <Icon
                  icon={`${hasSent ? 'tabler:check' : 'tabler:edit'}`}
                  color={hasSent ? '#28C76F' : '#FF9F43'}
                  fontSize='1.25rem'
                />
              </Button>
            </Stack>

            <DataGrid
              columns={initialColumns}
              rows={data || []}
              autoHeight
              sx={{
                '& .MuiDataGrid-columnHeaders': { backgroundColor: '#2F2B3D14' },
                width: { xs: '100%', sm: '472px' },
                borderRadius: '10px !important',
                border: 'none !important'
              }}
              disableColumnMenu
              paginationModel={paginationModel}
              slots={{
                footer: () => (
                  <CustomFooter
                    total={data?.length || 0}
                    totalPages={data?.length || 0}
                    page={paginationModel.page}
                    pageSize={paginationModel.pageSize}
                    onPageChange={newPage => setPaginationModel(prev => ({ ...prev, page: newPage }))}
                    info={false}
                  />
                )
              }}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Currency
