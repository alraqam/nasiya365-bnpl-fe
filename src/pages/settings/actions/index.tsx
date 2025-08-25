import { Button, Stack, DialogContent, Dialog, DialogTitle, Typography, MenuItem } from '@mui/material'
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
import toast from 'react-hot-toast'
import IAction from 'src/@core/types/action'
import IController from 'src/@core/types/controller'
import usePagination from 'src/hooks/usePagination'

const initialState = {
  name: '',
  code: '',
  controller: ''
} as const

const Actions = () => {
  const { modal, clearModal, setModal } = useModal()
  const { t } = useLang()

  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<null | number>(null)
  const [form, setForm] = useState(initialState)

  const initialColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', minWidth: 100 },
    { field: 'name', headerName: t.forms.actions.name, minWidth: 200 },
    { field: 'code', headerName: t.forms.actions.code, minWidth: 200 },
    { field: 'controller', headerName: t.forms.actions.controller, minWidth: 220 },
    {
      field: 'actions',
      headerName: t.actions,
      minWidth: 200,
      renderCell: params => {
        const id = params.row.id as number

        return (
          <Box sx={{ display: 'flex' }}>
            <Button
              sx={{ padding: '4px', width: 'fit-content', '&:hover': { backgroundColor: 'transparent' } }}
              onClick={() => {
                setEditingId(id)
                setModal('edit-action')
                setForm({
                  name: params.row.name,
                  code: params.row.code,
                  controller: params.row.conts_id
                })
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
              onClick={() => handleDeleteAction(id)}
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

  const { data: actions, fetchData: fetchActions } = useFetch<Response<IAction[]>>(`/api/action`)
  const { data: controllers } = useFetch<Response<IController[]>>('/api/controller')
  const { current_page, per_page } = actions?.data || {}
  const { paginationModel, setPaginationModel } = usePagination({ current_page, per_page })

  useEffect(() => {
    fetchActions(`/api/action?page=${paginationModel.page + 1}`)
  }, [paginationModel.page, fetchActions])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const handleAddAction = async () => {
    try {
      setLoading(true)
      const res = (await api('/api/action/store', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          code: form.code,
          conts_id: form.controller
        })
      })) as PostResponse<keyof typeof initialState>

      if (!res.status) {
        for (const [field, messages] of Object.entries(res.errors)) {
          for (const msg of messages) {
            toast.error(msg)
          }
        }
      } else {
        await fetchActions()
        clearModal()
        setForm(initialState)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAction = async () => {
    try {
      setLoading(true)
      const res = (await api(`/api/action/update/${editingId}`, {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          code: form.code,
          conts_id: form.controller
        })
      })) as PostResponse<keyof typeof initialState>

      if (!res.status) {
        for (const [field, messages] of Object.entries(res.errors)) {
          for (const msg of messages) {
            toast.error(msg)
          }
        }
      } else {
        await fetchActions()
        clearModal()
        setForm(initialState)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAction = async (id: number) => {
    try {
      setLoading(true)
      await api(`/api/action/destroy/${id}`, {
        method: 'DELETE'
      })
      await fetchActions()
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
          <Title title={t.pages.settings.actions} />
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
            <Button variant='contained' sx={{ gap: 2 }} onClick={() => setModal('add-action')}>
              <Icon svg='/icons/plus.svg' styles={theme => ({ backgroundColor: '#fff' })} />
              {t['add-action']}
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ backgroundColor: '#fff', borderRadius: '16px' }}>
          <DataGrid
            columns={initialColumns}
            rows={actions?.data.data || []}
            autoHeight
            sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fff' } }}
            disableColumnMenu
            paginationModel={paginationModel}
            slots={{
              footer: () => (
                <CustomFooter
                  total={actions?.data.total || 0}
                  totalPages={actions?.data.last_page || 0}
                  page={paginationModel.page}
                  pageSize={paginationModel.pageSize}
                  onPageChange={newPage => setPaginationModel(prev => ({ ...prev, page: newPage }))}
                />
              )
            }}
          />
        </Box>
      </Stack>

      {/* Add action */}
      <Dialog
        open={modal === 'add-action'}
        onClose={() => {
          clearModal()
          setForm(initialState)
          setEditingId(null)
        }}
      >
        <DialogTitle>
          <Typography variant='h4' align='center'>
            {t['add-action']}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Form>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.actions.name}</Typography>
              <CustomTextField fullWidth name='name' value={form.name} onChange={handleChange} />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.actions.code}</Typography>
              <CustomTextField fullWidth name='code' value={form.code} onChange={handleChange} />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.orders.status}</Typography>
              <CustomTextField select fullWidth name='controller' value={form.controller} onChange={handleChange}>
                {controllers?.data.data.map(controller => (
                  <MenuItem key={controller.id} value={controller.id}>
                    {controller.label}
                  </MenuItem>
                ))}
              </CustomTextField>
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
              <Button disabled={loading} variant='contained' onClick={handleAddAction}>
                {t.forms.submit}
              </Button>
            </Box>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit action */}
      <Dialog
        open={modal === 'edit-action'}
        onClose={() => {
          clearModal()
          setForm(initialState)
          setEditingId(null)
        }}
      >
        <DialogTitle>
          <Typography variant='h4' align='center'>
            {t['edit-action']}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Form>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.actions.name}</Typography>
              <CustomTextField fullWidth name='name' value={form.name} onChange={handleChange} />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.actions.code}</Typography>
              <CustomTextField fullWidth name='code' value={form.code} onChange={handleChange} />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <Typography>{t.forms.orders.status}</Typography>
              <CustomTextField select fullWidth name='controller' value={form.controller} onChange={handleChange}>
                {controllers?.data.data.map(controller => (
                  <MenuItem key={controller.id} value={controller.id}>
                    {controller.label}
                  </MenuItem>
                ))}
              </CustomTextField>
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
              <Button disabled={loading} variant='contained' onClick={handleUpdateAction}>
                {t.forms.submit}
              </Button>
            </Box>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Actions
