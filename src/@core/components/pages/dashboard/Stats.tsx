import { Box, Card, Stack, Typography, useTheme } from '@mui/material'
import CustomAvatar from '../../mui/avatar/custom'
import { Icon } from '@iconify/react'
import { ThemeColor } from 'src/@core/layouts/types'

interface Props {
  stats: string
  name: string
  iconColor: ThemeColor
}

const Stats = ({ stats, name, iconColor }: Props) => {
  const hex = useTheme().palette[iconColor].main

  return (
    <Card
      sx={{
        paddingX: '24px',
        paddingY: '22px',
        boxShadow: '0px 3px 12px 0px #2F2B3D24'
      }}
    >
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant='h3' sx={{ marginBottom: '2px', minWidth: 'max-content' }}>
            {stats}
          </Typography>
          <Typography color='#2F2B3DB2' sx={{ minWidth: 'max-content' }}>
            {name}
          </Typography>
        </Box>
        <CustomAvatar
          skin='light'
          color={iconColor}
          sx={{ height: 44, width: 44, fontSize: '0.6875rem', color: 'text.secondary', borderRadius: '6px' }}
        >
          <Icon icon='tabler:building-store' width={26} height={26} color={hex} />
        </CustomAvatar>
      </Stack>
    </Card>
  )
}

export default Stats
