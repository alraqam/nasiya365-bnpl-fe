import { Icon } from '@iconify/react'
import { Box, Button, Card, Menu, MenuItem, Stack, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useState } from 'react'
import { MONTHS } from 'src/@core/utils/constants'
import { useLang } from 'src/providers/LanguageProvider'

const Circle = styled(Box)(({ theme }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '9999px'
}))

const GeneralChart = () => {
  const { t } = useLang()

  const [month, setMonth] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Card
      sx={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxShadow: '0px 3px 12px 0px #2F2B3D24'
      }}
    >
      <Stack flexDirection='row' justifyContent='space-between'>
        <Box>
          <Typography variant='h5' sx={{ mb: 1 }}>
            Umumiy statistika
          </Typography>
          <Typography variant='h6' color='#2F2B3D8C'>
            Sotuv grafigi
          </Typography>
        </Box>

        <Stack direction='row' gap={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='body1' color='#2F2B3D66'>
              25 000 000 so'm
            </Typography>
            <Stack flexDirection='row' alignItems='center' gap={1}>
              <Circle sx={{ backgroundColor: '#666EE8' }} />
              <Typography color='#2F2B3DB2'>Naqd sotuv</Typography>
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='body1' color='#2F2B3D66'>
              25 000 000 so'm
            </Typography>
            <Stack flexDirection='row' alignItems='center' gap={1}>
              <Circle sx={{ backgroundColor: '#28C76F' }} />
              <Typography color='#2F2B3DB2'>Nasiya sotuv</Typography>
            </Stack>
          </Box>
        </Stack>

        <div>
          <Box
            id='basic-button'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: '#80839029',
              borderRadius: '6px'
            }}
          >
            <Box sx={{ paddingX: '20px', paddingY: '8px', minWidth: '100px' }}>
              <Typography sx={{ textAlign: 'center', color: '#808390' }}>
                {t.months[MONTHS[month] as keyof typeof t.months]}
              </Typography>
            </Box>
            <Box
              sx={{
                height: '38px',
                width: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderLeft: '1px solid #80839052'
              }}
            >
              <Icon icon='tabler:chevron-down' width={22} height={22} color='#808390' />
            </Box>
          </Box>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            {MONTHS.map((item, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  setMonth(index)
                  handleClose()
                }}
              >
                {t.months[item as keyof typeof t.months]}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Stack>
    </Card>
  )
}

export default GeneralChart
