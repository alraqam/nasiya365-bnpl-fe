import { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'

interface FormFieldProps {
  label?: string
  required?: boolean
  error?: string
  helperText?: string
  children: ReactNode
}

/**
 * Reusable form field wrapper component
 * Provides consistent styling and layout for form fields
 */
const FormField = ({ label, required, error, helperText, children }: FormFieldProps) => {
  return (
    <Box display='flex' flexDirection='column' gap={1}>
      {label && (
        <Typography component='label' sx={{ fontWeight: 500 }}>
          {label}
          {required && (
            <Typography component='span' color='error.main' sx={{ ml: 0.5 }}>
              *
            </Typography>
          )}
        </Typography>
      )}
      {children}
      {(error || helperText) && (
        <Typography variant='caption' color={error ? 'error.main' : 'text.secondary'}>
          {error || helperText}
        </Typography>
      )}
    </Box>
  )
}

export default FormField

