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
import checkRequiredFields from 'src/@core/utils/check-required-fields'
import useDebouncedFetch from 'src/hooks/useDebouncedFetch'
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
  selling_price: 0
}

const requiredFields = ['price', 'months', 'percentage']
const currencies = ['USD', 'UZS'] as const

const Calculator = () => {
  const { t } = useLang()
  const { setModal, modal, clearModal } = useModal()

  // Actual form
  const [form, setForm] = useState(initialForm)
  const [plan, setPlan] = useState('')
  const [currency, setCurrency] = useState<(typeof currencies)[number]>('USD')

  // Calculation results stored here
  const [total, setTotal] = useState(0)
  const [minMonthlyPayment, setMinMonthlyPayment] = useState(0)
  const [monthlyPayment, setMonthlyPayment] = useState(0)

  // Comes from backend
  const [tenure, setTenure] = useState(2)
  const [percentage, setPercentage] = useState(2)

  const { data: plans } = useFetch<{ id: number; tenure: number; percentage: number; name: string }[]>(
    'http://localhost:4000/plans',
    true,
    false
  )
  const { data: products, fetchData: fetchProducts } = useDebouncedFetch<
    { id: number; model: string; provider: string; price: number }[]
  >(`http://localhost:4000/products?model_like=${form.model}`, {
    auto: false,
    withBaseURL: false,
    delay: 700
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const handleMonthlyPayment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setMonthlyPayment(Number(val))
  }
  const handleMonthlyPaymentBlur = () => {
    if (monthlyPayment < minMonthlyPayment) {
      setMonthlyPayment(minMonthlyPayment)
    }
  }

  // Set the tenure and percentage when the plan is selected
  useEffect(() => {
    const selectedPlan = plans?.find(item => item.name === plan)

    setTenure(selectedPlan?.tenure || 0)
    setPercentage(selectedPlan?.percentage || 0)
  }, [plans])

  // Set the price of the device when it's selected
  useEffect(() => {
    if (products && form.model) {
      const searchedItem = products.find(item => item.model === form.model)

      if (searchedItem) {
        setForm(prev => ({
          ...prev,
          price: searchedItem.price
        }))
      }
    }
  }, [products, form.model])

  // Calculate
  useEffect(() => {
    const { price: priceStr, selling_price: depositStr } = form

    const price = Number(priceStr)
    const selling_price = Number(depositStr)

    const isValid = checkRequiredFields(requiredFields, form)

    if (isValid && tenure > 0) {
      const loan = price - selling_price

      const totalInterest = loan * (percentage / 100)
      const totalLoanWithInterest = loan + totalInterest

      const monthly = totalLoanWithInterest / tenure

      if (Number(monthly.toFixed(2)) <= minMonthlyPayment) {
        setMonthlyPayment(minMonthlyPayment)
      } else {
        setMonthlyPayment(Number(monthly.toFixed(2)))
      }
      setTotal(Number((totalLoanWithInterest + selling_price).toFixed(2)))
    } else {
      setMonthlyPayment(0)
      setTotal(0)
    }
  }, [form])

  const handleSubmit = async () => {
    console.log(monthlyPayment)
  }
  return (
    <>
      <IconButton sx={{ mr: 5 }} onClick={() => setModal('open-calculator')}>
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
            {t.forms.dashboard.calculator.dialog.title}
          </Typography>
          <Typography variant='body2' align='center'>
            {t.forms.dashboard.calculator.dialog.description}
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
                  minWidth: '0px'
                }
              })}
            >
              {/* Name */}
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography>{t.forms.dashboard.calculator.model}</Typography>
                <CustomAutocomplete
                  placeholder='Iphone 14 pro max'
                  freeSolo
                  options={products ?? []}
                  getOptionLabel={option => (typeof option === 'string' ? option : option.model ?? '')}
                  inputValue={form.model}
                  onInputChange={(event, newInputValue) => {
                    setForm(prev => ({ ...prev, model: newInputValue }))
                    fetchProducts()
                  }}
                  renderInput={params => <CustomTextField {...params} />}
                />
              </Box>
              {/* Price */}
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography>{t.forms.dashboard.calculator.price}</Typography>
                <CustomTextField
                  placeholder='0'
                  fullWidth
                  type='number'
                  InputProps={{
                    sx: {
                      paddingRight: '0px !important'
                    },
                    endAdornment: (
                      <InputAdornment position='start' sx={{ marginRight: '4px' }}>
                        <CustomTextField
                          select
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
              {/* Selling price */}
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography>Sotish narxi</Typography>
                <CustomTextField
                  placeholder='0'
                  fullWidth
                  type='number'
                  InputProps={{
                    sx: {
                      paddingRight: '0px !important'
                    },
                    endAdornment: (
                      <InputAdornment position='start' sx={{ marginRight: '4px' }}>
                        <CustomTextField
                          select
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
                  value={form.selling_price || null}
                  onChange={handleChange}
                />
              </Box>
              {/* Plan */}
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography>Tarif</Typography>
                <CustomTextField select fullWidth value={plan} onChange={e => setPlan(e.target.value)}>
                  {plans?.map(option => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Box>
              {/* Monthly payment */}
              <Box display='flex' flexDirection='column' gap={1}>
                <Typography>{t.forms.dashboard.calculator.monthly_payment}</Typography>
                <CustomTextField
                  placeholder='0'
                  fullWidth
                  name='monthlyPayment'
                  type='number'
                  value={monthlyPayment || null}
                  onChange={handleMonthlyPayment}
                  onBlur={handleMonthlyPaymentBlur}
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
                height: '420px',
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
                  gap: '10px'
                })}
              >
                <Typography variant='h6' color={'#7367F0'}>
                  {t.forms.dashboard.calculator.total_payment}
                </Typography>
                <Typography variant='h3' color={'#7367F0'}>
                  {total === 0 ? 0 : total.toFixed(2)} {currency}
                </Typography>
              </Card>

              <CustomTextField
                placeholder={t.forms.dashboard.calculator.model}
                disabled
                sx={disabledInput}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{form.model}</InputAdornment>
                }}
              />
              <CustomTextField
                placeholder={t.forms.dashboard.calculator.price}
                disabled
                sx={disabledInput}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{form.price}</InputAdornment>
                }}
              />
              <CustomTextField
                placeholder='Sotish narxi'
                disabled
                sx={disabledInput}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{form.selling_price}</InputAdornment>
                }}
              />
              {/* <CustomTextField
                placeholder={t.forms.dashboard.calculator.months}
                disabled
                sx={disabledInput}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{form.months}</InputAdornment>
                }}
              />
              <CustomTextField
                placeholder={t.forms.dashboard.calculator.percentage}
                disabled
                sx={disabledInput}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position='end'>{form.percentage}</InputAdornment>
                }}
              /> */}
            </Stack>
          </Stack>

          <Stack
            sx={{
              flexDirection: 'row',
              justifyContent: 'end'
            }}
          >
            <Button variant='contained' onClick={handleSubmit}>
              {t.forms.dashboard.calculator.cta}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Calculator
