import { Box, Card, Divider, Stack, styled, Typography } from '@mui/material'
import steps from './steps'
import Icon from 'src/@core/components/icon/icon'
import { Dispatch, SetStateAction, useState } from 'react'
import Basket from './basket'
import { useLang } from 'src/providers/LanguageProvider'
import Address from './address'

export const PaddingBox = styled(Box)(({ theme }) => ({
  padding: '24px'
}))

export const RightSideBox = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: '24px',
  maxWidth: '350px',
  width: '100%',
  height: 'max-content'
}))

export interface StepChildrenProps {
  setStep: Dispatch<SetStateAction<number>>
}

const Checkout = () => {
  const [step, setStep] = useState(1)

  const { t } = useLang()

  const resolveStep = () => {
    switch (step) {
      case 1:
        return <Basket setStep={setStep} />
      case 2:
        return <Address setStep={setStep} />
      default:
        return null
    }
  }

  return (
    <>
      <Card>
        {/* Stepper */}
        <Stack
          sx={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: '24px', gap: '16px' }}
        >
          {steps.map((item, index) => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px',
                  gap: '8px'
                }}
              >
                <Icon
                  svg={item.icon}
                  color={step >= item.activeStep ? '#7367F0' : '#2F2B3DE5'}
                  width={60}
                  height={60}
                />
                <Typography sx={{ color: step >= item.activeStep ? '#7367F0' : '#2F2B3DE5' }}>
                  {t.checkout.steps[item.label as keyof typeof t.checkout.steps]}
                </Typography>
              </Box>

              {/* Chevron icon is shown until the last step */}
              {index !== steps.length - 1 && (
                <Icon
                  svg='/icons/chevron-down.svg'
                  width={20}
                  height={20}
                  color={step > item.activeStep ? '#7367F0' : '#2F2B3DB2'}
                  styles={{ rotate: '-90deg' }}
                />
              )}
            </Box>
          ))}
        </Stack>

        <Divider />

        {resolveStep()}
      </Card>
    </>
  )
}

export default Checkout
