import { Checkbox, FormControlLabel, Menu, MenuItem } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

interface Props {
  columnVisibility: any
  handleColumnToggle: any
  anchorEl: any
  open: boolean
  handleCloseAnchorEl: any
  initialColumns: GridColDef[]
}

const ManageColumns = ({
  anchorEl,
  handleCloseAnchorEl,
  open,
  columnVisibility,
  handleColumnToggle,
  initialColumns
}: Props) => {
  return (
    <Menu
      id='column-menu'
      anchorEl={anchorEl}
      open={open}
      onClose={handleCloseAnchorEl}
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
                checkedIcon={
                  <img src='/icons/checked.svg' alt='check-icon' width={24} height={24} style={{ padding: '1px' }} />
                }
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
  )
}

export default ManageColumns
