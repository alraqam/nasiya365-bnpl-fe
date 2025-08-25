import { Box, Card, Divider, LinearProgress, Stack, Typography } from '@mui/material'
import React from 'react'
import CustomAvatar from '../../mui/avatar/custom'

const CurrentContracts = () => {
  return (
    <Card
      sx={{
        paddingX: '24px',
        paddingY: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '236px',
        boxShadow: '0px 3px 12px 0px #2F2B3D24'
      }}
    >
      <Box sx={{ gap: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <Typography variant='body2' sx={{ color: 'text.disabled' }}>
            Joriy shartnomalar
          </Typography>
          <Typography variant='h3'>214</Typography>
        </div>
        <Typography sx={{ fontWeight: 500, color: 'success.main' }}>+18.2%</Typography>
      </Box>

      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          flex: 1
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography variant='body1' color={'#2F2B3DB2'}>
            1 oy oldingi
          </Typography>
          <Typography variant='h4'>136</Typography>
        </Box>

        <Divider flexItem sx={{ m: 0 }} orientation='vertical'>
          <CustomAvatar
            skin='light'
            color='secondary'
            sx={{ height: 24, width: 24, fontSize: '0.6875rem', color: 'text.secondary' }}
          >
            VS
          </CustomAvatar>
        </Divider>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography variant='body1' color={'#2F2B3DB2'}>
            2 oy oldingi
          </Typography>
          <Typography variant='h4'>179</Typography>
        </Box>
      </Stack>

      <LinearProgress
        value={65}
        color='info'
        variant='determinate'
        sx={{
          height: 10,
          '&.MuiLinearProgress-colorInfo': { backgroundColor: 'primary.main' },
          '& .MuiLinearProgress-bar': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          }
        }}
      />
    </Card>
  )
}

export default CurrentContracts
