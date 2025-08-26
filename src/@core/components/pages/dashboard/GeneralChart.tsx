import { Icon } from '@iconify/react'
import { Box, Card, Menu, MenuItem, Stack, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/system'
import { useState } from 'react'
import { MONTHS } from 'src/@core/utils/constants'
import { useLang } from 'src/providers/LanguageProvider'
import { Line } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import useFetch from 'src/hooks/useFetch'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface Response {
  straight: Record<string, Record<string, number>>
  bnpl: Record<string, Record<string, number>>
}

const Circle = styled(Box)(({ theme }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '9999px'
}))

const primary = '#836af9'
const success = '#28c76f'
const borderColor = ''
const labelColor = ''

const GeneralChart = () => {
  const { t } = useLang()

  const [month, setMonth] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const currentMonth = new Date().getMonth()

  const availableMonths = MONTHS.slice(0, currentMonth + 1)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const { data: sales } = useFetch<Response>('http://localhost:4000/sales', true, false)

  if (!sales) return null

  const selectedMonth = MONTHS[month]

  const labels = Object.keys(sales.straight[selectedMonth])
  const straightValues = Object.values(sales.straight[selectedMonth])
  const bnplValues = Object.values(sales.bnpl[selectedMonth])

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: labelColor },
        grid: { color: borderColor }
      },
      y: {
        beginAtZero: true,
        ticks: { color: labelColor },
        grid: { color: borderColor }
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        ticks: { color: labelColor },
        grid: { drawOnChartArea: false }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }

  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'Naqd', // "Naqd sotuv"
        data: straightValues,
        borderColor: primary,
        backgroundColor: primary,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'Nasiya', // "Nasiya sotuv"
        data: bnplValues,
        borderColor: success,
        backgroundColor: success,
        tension: 0.4,
        pointRadius: 0
      }
    ]
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
      {/* Top */}
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
              <Circle sx={{ backgroundColor: primary }} />
              <Typography color='#2F2B3DB2'>Naqd sotuv</Typography>
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='body1' color='#2F2B3D66'>
              25 000 000 so'm
            </Typography>
            <Stack flexDirection='row' alignItems='center' gap={1}>
              <Circle sx={{ backgroundColor: success }} />
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
            {availableMonths.map((item, index) => (
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

      {/* Bottom */}
      <Box sx={{ height: 400 }}>
        <Line data={data} height={400} options={options} />
      </Box>
    </Card>
  )
}

export default GeneralChart
