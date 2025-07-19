import { GridColDef } from '@mui/x-data-grid'
import { useState } from 'react'

const useManageColumns = (initialColumns: GridColDef[]) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    return initialColumns.reduce((acc, col) => {
      acc[col.field] = true
      
return acc
    }, {} as Record<string, boolean>)
  })

  const handleSetAnchorEl = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseAnchorEl = () => {
    setAnchorEl(null)
  }

  const handleColumnToggle = (field: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const visibleColumns = initialColumns.filter(col => columnVisibility[col.field])

  return {
    anchorEl,
    open: Boolean(anchorEl),
    handleSetAnchorEl,
    handleCloseAnchorEl,
    handleColumnToggle,
    columnVisibility,
    visibleColumns
  }
}

export default useManageColumns
