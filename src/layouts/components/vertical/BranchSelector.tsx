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

  // Validate and set branch selection
  useEffect(() => {
    if (!branchesLoading && branches) {
      // Check if current branch exists in the list
      const branchExists = branch !== '' && branches.some(b => b.id === branch)
      
      // If selected branch doesn't exist, reset to empty or set first branch
      if (!branchExists) {
        if (branches.length > 0) {
          const firstBranchId = branches[0].id
          setBranch(firstBranchId)
          storage.setItem(BRANCH_STORAGE_KEY, String(firstBranchId))
        } else {
          setBranch('')
          storage.removeItem(BRANCH_STORAGE_KEY)
        }
      }
    }
  }, [branches, branchesLoading, branch])

  return (
    <Box sx={{ ml: 3, minWidth: 200, display: { xs: 'none', md: 'block' } }}>
      <CustomTextField
        select
        fullWidth
        size="small"
        value={branchesLoading ? '' : branch}
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

