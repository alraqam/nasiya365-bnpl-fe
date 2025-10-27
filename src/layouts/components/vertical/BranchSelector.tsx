import { IconButton, MenuItem, Box } from '@mui/material'
import { useState, useEffect } from 'react'
import { useLang } from 'src/providers/LanguageProvider'
import { useBranches } from 'src/hooks/api/useBranches'
import CustomTextField from 'src/@core/components/mui/text-field'
import { storage } from 'src/@core/utils/storage'
import { Icon } from '@iconify/react'

const BRANCH_STORAGE_KEY = 'selected_branch_id'

const BranchSelector = () => {
  const { t } = useLang()
  const { branches, loading: branchesLoading } = useBranches()
  
  // Initialize from localStorage
  const [branch, setBranch] = useState<number | ''>(() => {
    const stored = storage.getItem(BRANCH_STORAGE_KEY)
    return stored ? Number(stored) : ''
  })

  // Save to localStorage when branch changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const branchId = value === '' ? '' : Number(value)
    setBranch(branchId)
    
    if (branchId !== '') {
      storage.setItem(BRANCH_STORAGE_KEY, String(branchId))
    } else {
      storage.removeItem(BRANCH_STORAGE_KEY)
    }
  }

  // Set first branch as default if none selected
  useEffect(() => {
    if (!branchesLoading && branches && branches.length > 0 && branch === '') {
      const firstBranchId = branches[0].id
      setBranch(firstBranchId)
      storage.setItem(BRANCH_STORAGE_KEY, String(firstBranchId))
    }
  }, [branches, branchesLoading, branch])

  return (
    <Box sx={{ ml: 3, minWidth: 200, display: { xs: 'none', md: 'block' } }}>
      <CustomTextField
        select
        fullWidth
        size="small"
        value={branch}
        onChange={handleChange}
        disabled={branchesLoading}
        InputProps={{
          startAdornment: (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <Icon icon='tabler:building-store' fontSize={20} color='#2F2B3DE5' />
            </Box>
          )
        }}
        sx={{
          '& .MuiInputBase-root': {
            backgroundColor: 'transparent'
          }
        }}
      >
        {branchesLoading ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : branches && branches.length > 0 ? (
          branches.map(b => (
            <MenuItem key={b.id} value={b.id}>
              {b.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No branches available</MenuItem>
        )}
      </CustomTextField>
    </Box>
  )
}

export default BranchSelector

