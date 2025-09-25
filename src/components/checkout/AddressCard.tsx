import { PaddingBox } from 'src/pages/checkout'
import Checkbox from '../ui/checkbox'
import { Box, Button, Stack, Typography } from '@mui/material'
import Chip from 'src/@core/components/mui/chip'
import { useLang } from 'src/providers/LanguageProvider'

interface Props {
  id: number
  name: string
  location: string
  number: string
  payment: string
  address_of: string
  isSelected: boolean
  handleSelect: (id: number) => void
}

const AddressCard = ({ id, name, location, number, payment, address_of, isSelected, handleSelect }: Props) => {
  const { t } = useLang()

  return (
    <PaddingBox
      sx={{
        display: 'flex',
        border: isSelected ? '1px solid #7367F0' : '1px solid #2F2B3D1F',
        cursor: 'pointer',
        borderRadius: '6px',
        gap: '8px'
      }}
      onClick={() => handleSelect(id)}
    >
      <Checkbox checked={isSelected} onClick={() => handleSelect(id)} />

      <Stack sx={{ width: '100%', mt: '2px', gap: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography fontWeight={600} variant='h6'>
            {name}
          </Typography>
          <Chip label={address_of} color='primary' skin='light' rounded />
        </Box>

        <Box>
          <Typography color='#2F2B3DB2'>{location}</Typography>
          <Typography color='#2F2B3DB2'>
            {t.phone}: {number}
          </Typography>
          <Typography color='#2F2B3DB2'>
            {t.payment}: {payment}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Button
            variant='outlined'
            color='primary'
            sx={{ border: 'none', px: '6px', '&:hover': { border: 'none', background: 'none' } }}
          >
            {t.edit}
          </Button>
          <Button
            variant='outlined'
            color='error'
            sx={{ border: 'none', px: '6px', '&:hover': { border: 'none', background: 'none' } }}
          >
            {t.delete}
          </Button>
        </Box>
      </Stack>
    </PaddingBox>
  )
}

export default AddressCard
