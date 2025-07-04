// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTranslation } from 'next-i18next'
import Title from 'src/@core/components/title'
import CustomTextField from 'src/@core/components/mui/text-field'
import { Box, Button, MenuItem, Stack } from '@mui/material'
import { useState } from 'react'
import { MONTHS, YEARS } from 'src/@core/utils/constants'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { minWidth } from '@mui/system'

const initialYear = new Date().getFullYear().toString()
const initialMonth = MONTHS[new Date().getMonth()]

const Home = () => {
  const [type, setType] = useState<'monthly' | 'yearly' | 'general' | 'custom'>('monthly')
  const [monthly, setMonthly] = useState({
    year: initialYear,
    month: initialMonth
  })
  const [yearly, setYearly] = useState(initialYear)
  const [custom, setCustom] = useState({
    from: new Date(),
    to: new Date()
  })

  console.log(custom.from)

  const { t } = useTranslation()

  return (
    <Grid container spacing={6}>
      {/* Title at the top */}
      <Grid item xs={12} alignItems='start'>
        <Title title='Dashboard' />
      </Grid>

      {/* Container with space-between layout */}
      <Grid item xs={12}>
        <Grid
          container
          justifyContent='space-between'
          alignItems='center'
          spacing={2}
          sx={theme => ({ [theme.breakpoints.down('md')]: { flexDirection: 'column' } })}
        >
          {/* Left side - Stack with 2 selects */}
          <Grid item sx={theme => ({ [theme.breakpoints.down('md')]: { width: '100%' } })}>
            <Grid
              container
              direction='row'
              gap={3}
              alignItems='center'
              sx={theme => ({ [theme.breakpoints.down('md')]: { minWidth: '100%' } })}
            >
              <Box
                sx={theme => ({
                  minWidth: 138,
                  [theme.breakpoints.down('md')]: {
                    minWidth: '100%'
                  }
                })}
              >
                <CustomTextField select fullWidth value={type} onChange={e => setType(e.target.value as typeof type)}>
                  <MenuItem value='monthly'>{t('periods.monthly')}</MenuItem>
                  <MenuItem value='yearly'>{t('periods.yearly')}</MenuItem>
                  <MenuItem value='general'>{t('periods.general')}</MenuItem>
                  <MenuItem value='custom'>{t('periods.custom')}</MenuItem>
                </CustomTextField>
              </Box>
              {type === 'monthly' && (
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing={3}
                  sx={theme => ({ [theme.breakpoints.down('md')]: { minWidth: '100%' } })}
                >
                  <CustomTextField
                    select
                    fullWidth
                    value={monthly.year}
                    onChange={e => setMonthly({ ...monthly, year: e.target.value })}
                    sx={theme => ({ [theme.breakpoints.down('md')]: { minWidth: '100%' } })}
                  >
                    {YEARS.map((year, index) => (
                      <MenuItem key={index} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                  <CustomTextField
                    select
                    fullWidth
                    value={monthly.month}
                    onChange={e => setMonthly({ ...monthly, month: e.target.value })}
                    sx={theme => ({ [theme.breakpoints.down('md')]: { minWidth: '100%' } })}
                  >
                    {MONTHS.map((month, index) => (
                      <MenuItem key={index} value={month}>
                        {t(`months.${month}`)}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Stack>
              )}
              {type === 'yearly' && (
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing={3}
                  sx={theme => ({ [theme.breakpoints.down('md')]: { minWidth: '100%' } })}
                >
                  <CustomTextField select fullWidth value={yearly} onChange={e => setYearly(e.target.value)}>
                    {YEARS.map((year, index) => (
                      <MenuItem key={index} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Stack>
              )}
              {type === 'custom' && (
                <Stack
                  direction='row'
                  alignItems='center'
                  spacing={3}
                  sx={theme => ({ [theme.breakpoints.down('md')]: { minWidth: '100%' } })}
                >
                  <DatePickerWrapper
                    sx={theme => ({
                      [theme.breakpoints.down('md')]: {
                        width: '100%'
                      }
                    })}
                  >
                    <DatePicker
                      selected={custom.from}
                      onChange={date => setCustom({ ...custom, from: date as Date })}
                      dateFormat='dd.MM.yyyy'
                      customInput={
                        <CustomTextField
                          variant='filled'
                          sx={theme => ({
                            backgroundColor: '#fff !important',
                            borderRadius: '6px',
                            boxShadow: '0px 1px 8px 0px #53505E14',
                            '& .MuiInputBase-root': {
                              border: 'none !important',
                              borderRadius: 6
                            },
                            [theme.breakpoints.down('md')]: {
                              width: '100%'
                            }
                          })}
                        />
                      }
                    />
                  </DatePickerWrapper>
                  <DatePickerWrapper
                    sx={theme => ({
                      [theme.breakpoints.down('md')]: {
                        width: '100%'
                      }
                    })}
                  >
                    <DatePicker
                      selected={custom.to}
                      onChange={date => setCustom({ ...custom, to: date as Date })}
                      dateFormat='dd.MM.yyyy'
                      customInput={
                        <CustomTextField
                          sx={theme => ({
                            backgroundColor: '#fff !important',
                            borderRadius: '6px',
                            boxShadow: '0px 1px 8px 0px #53505E14',
                            '& .MuiInputBase-root': {
                              border: 'none !important',
                              borderRadius: 6
                            },
                            [theme.breakpoints.down('md')]: {
                              width: '100%'
                            }
                          })}
                        />
                      }
                    />
                  </DatePickerWrapper>
                </Stack>
              )}
              <Box
                sx={theme => ({
                  [theme.breakpoints.down('md')]: {
                    minWidth: '100%'
                  }
                })}
              >
                <Button
                  variant='tonal'
                  sx={theme => ({ minWidth: '140px', [theme.breakpoints.down('md')]: { minWidth: '100%' } })}
                >
                  {t('view')}
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Right side - Button/CardHeader */}
          <Grid item sx={theme => ({ [theme.breakpoints.down('md')]: { ml: 'auto' } })}>
            <Card>
              <Card sx={{ px: 4, height: '44px', display: 'flex', alignItems: 'center', color: '#000 !important' }}>
                {t('balance')}: $9 223.90
              </Card>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Home
