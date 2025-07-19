import React from 'react'
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import IconifyIcon from '../../icon'

const DestructiveAlert = React.forwardRef<HTMLDivElement, AlertProps>(function DestructiveAlert(props, ref) {
  return (
    <MuiAlert
      elevation={3}
      ref={ref}
      variant='filled'
      iconMapping={{
        error: <IconifyIcon icon='mdi:alert-circle-outline' />
      }}
      sx={{
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        color: '#333',
        borderRadius: '6px',
        padding: '16px',
        boxShadow: '0px 3px 12px 0px #2F2B3D24',
        '& .MuiAlert-icon': {
          color: '#F04438',
          margin: 0,
          marginRight: 2,
          padding: 0
        },
        '& .MuiAlert-message': {
          fontWeight: 500,
          fontSize: '14px',
          padding: 0
        }
      }}
      {...props}
    />
  )
})

export default function CustomSnackbar(props: SnackbarProps) {
  const { message } = props
  
return (
    <Snackbar {...props} sx={{ display: 'flex', alignItems: 'center' }}>
      <DestructiveAlert severity='error'>{message}</DestructiveAlert>
    </Snackbar>
  )
}
