import { Button, Stack, DialogContent, Dialog, DialogTitle, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Title from 'src/@core/components/title'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon/icon'
import CustomFooter from 'src/@core/components/TableFooter'
import useModal from 'src/@core/store/modal'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useLang } from 'src/providers/LanguageProvider'
import { api } from 'src/configs/api'
import useFetch from 'src/hooks/useFetch'
import Form from 'src/@core/components/DialogForm'
import { PostResponse, Response } from 'src/@core/types/base-response'
import IController from 'src/@core/types/controller'
import toast from 'react-hot-toast'

const initialState = {
  label: '',
  name: ''
} as const

const Permissions = () => {
  const initialColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', minWidth: 100 },
    { field: 'name', headerName: 'Nomi', flex: 1 },
    { field: 'label', headerName: 'Izoh', flex: 1 },
    {
      field: 'actions',
      headerName: 'Harakatlar',
      minWidth: 200,
      renderCell: params => {
        const id = params.row.id as number

        return (
          <Box sx={{ display: 'flex' }}>
            <Button
              sx={{ padding: '4px', width: 'fit-content', '&:hover': { backgroundColor: 'transparent' } }}
              onClick={() => {
                setEditingId(id)
                setModal('edit-role')
              }}
            >
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
            <Button
              sx={{ padding: '4px', width: 'fit-content', '&:hover': { backgroundColor: 'transparent' } }}
              onClick={() => handleDeleteController(id)}
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

  const { modal, clearModal, setModal } = useModal()
  const { t } = useLang()

  const { data, fetchData } = useFetch<Response<IController[]>>('/api/controller')

  const [paginationModel, setPaginationModel] = useState({
    page: Number(data?.data.current_page) || 0,
    pageSize: data?.data.per_page || 10
  })

  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<null | number>(null)
  const [form, setForm] = useState(initialState)

  useEffect(() => {
    if (data?.data) {
      setPaginationModel({
        page: Number(data.data.current_page) - 1,
        pageSize: data.data.per_page
      })
    }
  }, [data])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const handleAddController = async () => {
    try {
      setLoading(true)
      const res = (await api('/api/controller/store', {
        method: 'POST',
        body: JSON.stringify(form)
      })) as PostResponse<keyof typeof initialState>

      if (!res.status) {
        for (const [field, messages] of Object.entries(res.errors)) {
          for (const msg of messages) {
            toast.error(msg)
          }
        }
      } else {
        await fetchData()
        clearModal()
        setForm(initialState)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateController = async () => {
    try {
      setLoading(true)
      const res = (await api(`/api/controller/update/${editingId}`, {
        method: 'POST',
        body: JSON.stringify(form)
      })) as PostResponse<keyof typeof initialState>

      if (!res.status) {
        for (const [field, messages] of Object.entries(res.errors)) {
          for (const msg of messages) {
            toast.error(msg)
          }
        }
      } else {
        await fetchData()
        clearModal()
        setForm(initialState)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteController = async (id: number) => {
    try {
      setLoading(true)
      await api(`/api/controller/destroy/${id}`, {
        method: 'DELETE'
      })
      await fetchData()
      clearModal()
      setForm(initialState)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
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
          <Title title={t.pages.settings.controllers} />
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
            <Button variant='contained' sx={{ gap: 2 }} onClick={() => setModal('add-controller')}>
              <Icon svg='/icons/plus.svg' styles={theme => ({ backgroundColor: '#fff' })} />
              {t['add-controller']}
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ backgroundColor: '#fff', borderRadius: '16px' }}>
          <DataGrid
            columns={initialColumns}
            rows={data?.data.data || []}
            autoHeight
            sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fff' } }}
            disableColumnMenu
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            slots={{
              footer: () => (
                <CustomFooter
                  total={data?.data.total || 0}
                  totalPages={data?.data.last_page || 0}
                  page={paginationModel.page}
                  pageSize={paginationModel.pageSize}
                  onPageChange={newPage => setPaginationModel(prev => ({ ...prev, page: newPage }))}
                />
              )
            }}
          />
        </Box>
      </Stack>

      {/* Add controller */}
      <Dialog
        open={modal === 'add-controller'}
        onClose={() => {
          clearModal()
          setForm(initialState)
          setEditingId(null)
        }}
      >
        <DialogTitle>
          <Typography variant='h4' align='center'>
            {t['add-controller']}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Form>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.roles.name}</Typography>
              <CustomTextField fullWidth name='name' value={form.name} onChange={handleChange} />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.roles.label}</Typography>
              <CustomTextField fullWidth name='label' value={form.label} onChange={handleChange} />
            </Box>
            <Box display='flex' justifyContent='center' gap={4}>
              <Button
                disabled={loading}
                variant='outlined'
                type='button'
                onClick={() => {
                  clearModal()
                  setForm(initialState)
                  setEditingId(null)
                }}
              >
                {t.close}
              </Button>
              <Button disabled={loading} variant='contained' onClick={handleAddController}>
                {t.forms.submit}
              </Button>
            </Box>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit role */}
      <Dialog
        open={modal === 'edit-role'}
        onClose={() => {
          clearModal()
          setForm(initialState)
          setEditingId(null)
        }}
      >
        <DialogTitle>
          <Typography variant='h4' align='center'>
            {t['edit-role']}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Form>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.roles.name}</Typography>
              <CustomTextField fullWidth name='name' value={form.name} onChange={handleChange} />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.roles.label}</Typography>
              <CustomTextField fullWidth name='label' value={form.label} onChange={handleChange} />
            </Box>
            <Box display='flex' justifyContent='center' gap={4}>
              <Button
                disabled={loading}
                variant='outlined'
                type='button'
                onClick={() => {
                  clearModal()
                  setForm(initialState)
                  setEditingId(null)
                }}
              >
                {t.close}
              </Button>
              <Button disabled={loading} variant='contained' onClick={handleUpdateController}>
                {t.forms.submit}
              </Button>
            </Box>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Permissions
