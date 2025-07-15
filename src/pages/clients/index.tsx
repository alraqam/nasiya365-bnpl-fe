import { Button, Stack, Menu, MenuItem, FormControlLabel, Checkbox, Typography } from '@mui/material'
import React, { useState } from 'react'
import Title from 'src/@core/components/title'
import clients from 'src/fake-data/clients'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon/icon'

const initialColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', minWidth: 100 },
  { field: 'name', headerName: 'Ismi', minWidth: 250 },
  { field: 'passport', headerName: 'Passport raqami', minWidth: 300 },
  { field: 'address', headerName: 'Manzil', minWidth: 150 },
  { field: 'phone', headerName: 'Telefon raqami', minWidth: 300 },
  { field: 'state', headerName: 'Holati', minWidth: 300 },
  { field: 'gender', headerName: 'Jinsi', minWidth: 300 },
  { field: 'email', headerName: 'Email', minWidth: 300 },
  {
    field: 'actions',
    headerName: 'Harakatlar',
    minWidth: 200,
    renderCell: () => (
      <Box sx={{ display: 'flex' }}>
        <Button sx={{ padding: '4px', width: 'fit-content' }}>
          <Icon svg='/icons/edit.svg' width={24} height={24} />
        </Button>
        <Button sx={{ padding: '4px', width: 'fit-content' }}>
          <Icon svg='/icons/trash.svg' width={24} height={24} />
        </Button>
      </Box>
    )
  }
]

const Clients = () => {
  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    // Initialize all columns as visible
    return initialColumns.reduce((acc, col) => {
      acc[col.field] = true
      return acc
    }, {} as Record<string, boolean>)
  })

  // State for dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  // Handle menu open/close
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // Handle column visibility toggle
  const handleColumnToggle = (field: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  // Filter columns based on visibility
  const visibleColumns = initialColumns.filter(col => columnVisibility[col.field])

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
          <Title title='Clients' />
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
            <Button variant='tonal' sx={{ gap: 2 }}>
              <Icon svg='/icons/reload.svg' styles={theme => ({ backgroundColor: theme.palette.primary.main })} />
              Qayta yuklash
            </Button>

            {/* Column Management Button */}
            <Button
              variant='tonal'
              sx={{ gap: 2 }}
              onClick={handleClick}
              aria-controls={open ? 'column-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
            >
              Ma'lumotlar tartibi
              <Icon svg='/icons/chevron-down.svg' styles={theme => ({ backgroundColor: theme.palette.primary.main })} />
            </Button>

            {/* Column Management Menu */}
            <Menu
              id='column-menu'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'column-button'
              }}
              PaperProps={{
                sx: {
                  minWidth: 250,
                  '& .MuiMenuItem-root': {
                    padding: '8px 16px'
                  }
                }
              }}
            >
              {initialColumns.map(column => (
                <MenuItem key={column.field} sx={{ padding: '0px !important' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={columnVisibility[column.field]}
                        onChange={() => handleColumnToggle(column.field)}
                        size='small'
                        sx={{
                          color: 'primary.main', // default color when unchecked
                          '&.Mui-checked': {
                            color: 'secondary.main', // color when checked
                            backgroundColor: 'primary' // background stays transparent
                          },
                          '&:hover': {
                            backgroundColor: 'action.hover' // subtle hover effect
                          }
                        }}
                      />
                    }
                    label={column.headerName}
                    sx={{
                      width: '100%',
                      margin: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                </MenuItem>
              ))}
            </Menu>

            <Button variant='contained' sx={{ gap: 2 }}>
              <Icon svg='/icons/plus.svg' styles={theme => ({ backgroundColor: '#fff' })} />
              Mijoz qo'shish
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ backgroundColor: '#fff', borderRadius: '16px' }}>
          <DataGrid
            columns={visibleColumns}
            rows={clients}
            autoHeight
            sx={{ '& .MuiDataGrid-columnHeaders': { backgroundColor: '#fff' } }}
            disableColumnMenu
            pagination
          />
        </Box>
      </Stack>
    </>
  )
}

export default Clients
