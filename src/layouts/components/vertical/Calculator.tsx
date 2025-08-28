import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  IconButtonProps,
  InputAdornment,
  MenuItem,
  Stack,
  styled,
  Theme,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import Form from 'src/@core/components/DialogForm'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'
import CustomTextField from 'src/@core/components/mui/text-field'
import useModal from 'src/@core/store/modal'
import IDevice from 'src/@core/types/device'
import useFetch from 'src/hooks/useFetch'
import { useLang } from 'src/providers/LanguageProvider'

interface Response {
  data: IDevice[]
}

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: '10px',
  right: '-10px',
  color: '#2F2B3DE5',
  position: 'absolute',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`
}))

const disabledInput = {
  '& .MuiInputBase-root.Mui-disabled': {
    border: 'none !important',
    backgroundColor: '#2F2B3D14'
  },
  '& .MuiInputBase-input.Mui-disabled::placeholder': {
    color: '#000',
    opacity: 1
  }
}

const initialForm = {
  model: '',
  price: 0,
  deposit: 0,
  months: 0,
  percentage: 0
}

const requiredFields = ['price', 'months', 'percentage']

const currencies = ['USD', 'UZS'] as const

const Calculator = () => {
  const { t } = useLang()
  const { setModal, modal, clearModal } = useModal()

  const [form, setForm] = useState(initialForm)
  const [currency, setCurrency] = useState<(typeof currencies)[number]>('USD')

  const [total, setTotal] = useState(0)
  const [monthlyPayment, setMonthlyPayment] = useState(0)

  const [url, setUrl] = useState('/api/devices')

  const { data, fetchData } = useFetch<Response>(url)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  useEffect(() => {
    if (data && form.model) {
      const searchedItem = data.data.find(item => item.model === form.model)

      if (searchedItem) {
        setForm(prev => ({
          ...prev,
          price: searchedItem.incoming_price
        }))
      }
    }
  }, [data, form.model])

  useEffect(() => {
    const { months: monthsStr, price: priceStr, deposit: depositStr, percentage: percentageStr } = form

    const months = Number(monthsStr)
    const price = Number(priceStr)
    const deposit = Number(depositStr)
    const percentage = Number(percentageStr)

    // check required fields
    const isValid = requiredFields.every(
      field => form[field as keyof typeof form] !== '' && !isNaN(Number(form[field as keyof typeof form]))
    )

    if (isValid && months > 0) {
      const loan = price - deposit

      // ✅ new logic: percentage is for the total period, not monthly
      const totalInterest = loan * (percentage / 100)
      const totalLoanWithInterest = loan + totalInterest

      const monthly = totalLoanWithInterest / months

      setMonthlyPayment(Number(monthly.toFixed(2))) // round to 2 decimals
      setTotal(Number((totalLoanWithInterest + deposit).toFixed(2)))
    } else {
      // reset if form incomplete
      setMonthlyPayment(0)
      setTotal(0)
    }
  }, [form])

  const handleSubmit = async () => {
    console.log(form)
  }
  return (
    <>
      <IconButton onClick={() => setModal('open-calculator')}>
        <Icon fontSize='1.5rem' icon='tabler:calculator' color='#2F2B3DE5' />
      </IconButton>

      <Dialog
        open={modal === 'open-calculator'}
        onClose={clearModal}
        PaperProps={{
          sx: { width: 'max-content', maxWidth: '100%', paddingTop: '0px !important' }
        }}
      >
        <DialogTitle sx={{ position: 'relative' }}>
          <Typography variant='h4' align='center'>
            Kalkulyator
          </Typography>
          <Typography variant='body2' align='center'>
            Mahsulot ma’lumotlarini kiriting
          </Typography>
          <CustomCloseButton aria-label='close' onClick={clearModal}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <Divider sx={{ width: '100%', marginTop: '16px' }} />
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', paddingY: '0px !important', paddingX: '12px !important' }}
        >
          <Stack
            sx={theme => ({
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              gap: '64px',
              paddingY: '28px',
              [theme.breakpoints.down('md')]: {
                // flexDirection: 'column',
                gap: '16px'
              },
              [theme.breakpoints.down('sm')]: {
                flexDirection: 'column'
              }
            })}
          >
            <Form
              sx={theme => ({
                maxWidth: '470px',
                minWidth: '470px',
                width: '100% !important',
                [theme.breakpoints.down('lg')]: {
                  minWidth: '0px' // 👈 example override on sm+
                }
              })}
            >
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography>Mahsulot nomi</Typography>
                <CustomAutocomplete
                  placeholder='Iphone 14 pro max'
                  freeSolo
                  options={data?.data ?? []}
                  getOptionLabel={option => (typeof option === 'string' ? option : option.model ?? '')}
                  renderInput={params => <CustomTextField {...params} />}
                  isOptionEqualToValue={(option, value) =>
                    typeof option !== 'string' && typeof value !== 'string' && option.id === value.id
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={typeof option === 'string' ? option : option.id}>
                      {typeof option === 'string' ? option : option.model}
                    </li>
                  )}
                  onChange={(event, value) => {
                    setForm({
                      ...form,
                      model: typeof value === 'string' ? value : value?.model ?? ''
                    })
                  }}
                />
              </Box>
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography>Tannarx</Typography>
                <CustomTextField
                  placeholder='0'
                  fullWidth
                  InputProps={{
                    sx: {
                      paddingRight: '0px !important'
                    },
                    endAdornment: (
                      <InputAdornment position='start' sx={{ marginRight: '4px' }}>
                        <CustomTextField
                          select
                          placeholder='Hello'
                          sx={{
                            minWidth: '50px',
                            '& .MuiInputBase-root': {
                              border: 'none !important',
                              boxShadow: 'none !important',
                              '& .MuiBox-root': {
                                minWidth: '20px',
                                minHeight: '25px'
                              },
                              '& .MuiSelect-select': {
                                minWidth: 'max-content !important',
                                paddingRight: '4px !important'
                              }
                            }
                          }}
                          value={currency}
                          onChange={e => setCurrency(e.target.value as (typeof currencies)[number])}
                        >
                          {currencies.map(option => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      </InputAdornment>
                    )
                  }}
                  name='price'
                  value={form.price || null}
                  onChange={handleChange}
                />
              </Box>
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography>Boshlang'ich to'lov</Typography>
                <CustomTextField
                  placeholder='0'
                  fullWidth
                  InputProps={{
                    sx: {
                      paddingRight: '0px !important'
                    },
                    endAdornment: (
                      <InputAdornment position='start' sx={{ marginRight: '4px' }}>
                        <CustomTextField
                          select
                          placeholder='Hello'
                          sx={{
                            minWidth: '50px',
                            '& .MuiInputBase-root': {
                              border: 'none !important',
                              boxShadow: 'none !important',
                              '& .MuiBox-root': {
                                minWidth: '20px',
                                minHeight: '25px'
                              },
                              '& .MuiSelect-select': {
                                minWidth: 'max-content !important',
                                paddingRight: '4px !important'
                              }
                            }
                          }}
                          value={currency}
                          onChange={e => setCurrency(e.target.value as (typeof currencies)[number])}
                        >
                          {currencies.map(option => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      </InputAdornment>
                    )
                  }}
                  name='deposit'
                  value={form.deposit || null}
                  onChange={handleChange}
                />
              </Box>
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography>Qancha muddatga</Typography>
                <CustomTextField
                  placeholder='0 oy'
                  fullWidth
                  name='months'
                  value={form.months || null}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>oy</InputAdornment>
                  }}
                />
              </Box>
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography>Foiz to'lov</Typography>
                <CustomTextField
                  placeholder='0 %'
                  fullWidth
                  name='percentage'
                  value={form.percentage || null}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>%</InputAdornment>
                  }}
                />
              </Box>
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography>Oylik to'lov</Typography>
                <CustomTextField
                  placeholder='0'
                  fullWidth
                  name='monthlyPayment'
                  value={monthlyPayment || null}
                  onChange={handleChange}
                  disabled={monthlyPayment === 0}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>{currency}</InputAdornment>
                  }}
                />
              </Box>
            </Form>

            <Stack
              sx={theme => ({
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                maxWidth: '470px',
                minWidth: '470px',
                height: '520px',
                width: '100%',
                [theme.breakpoints.down('lg')]: {
                  maxWidth: '450px',
                  minWidth: '0px'
                },
                [theme.breakpoints.down('md')]: {
                  maxWidth: '282px',
                  minWidth: '0px'
                },
                [theme.breakpoints.down('sm')]: {
                  maxWidth: '100%'
                  //   minWidth: '470px'
                }
              })}
            >
              <Card
                sx={(theme: Theme) => ({
                  padding: '21px 32px',
                  background: '#7367F03D',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  flex: 1
                })}
              >
                <Typography variant='h6' color={'#7367F0'}>
                  Umumiy to'lov
                </Typography>
                <Typography variant='h3' color={'#7367F0'}>
                  {total === 0 ? 0 : total.toFixed(2)} {currency}
                </Typography>
              </Card>

              <CustomTextField
                placeholder='Mahsulot nomi'
                disabled
                sx={disabledInput}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{form.model}</InputAdornment>
                }}
              />
              <CustomTextField
                placeholder='Tannarxi'
                disabled
                sx={disabledInput}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{form.price}</InputAdornment>
                }}
              />
              <CustomTextField
                placeholder="Bosh to'lov"
                disabled
                sx={disabledInput}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{form.deposit}</InputAdornment>
                }}
              />
              <CustomTextField
                placeholder='Qancha muddatga'
                disabled
                sx={disabledInput}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{form.months}</InputAdornment>
                }}
              />
              <CustomTextField
                placeholder='Oylik foiz'
                disabled
                sx={disabledInput}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{form.percentage}</InputAdornment>
                }}
              />
            </Stack>
          </Stack>

          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'end'
            }}
          >
            <Button variant='contained'>Rasmiylashtirish</Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Calculator
