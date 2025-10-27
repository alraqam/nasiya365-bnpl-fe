import { Box, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon/icon'
import Checkbox from '../ui/checkbox'
import Chip from 'src/@core/components/mui/chip'
import { useLang } from 'src/providers/LanguageProvider'

interface Props {
  id: number
  icon: string
  title: string
  desc: string
  price: number
  isSelected: boolean
  handleSelect: (id: number) => void
}

const DeliveryPlanCard = ({ id, icon, title, desc, price, isSelected, handleSelect }: Props) => {
  const { t } = useLang()
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: '6px',
        border: isSelected ? '1px solid #0553F1' : '1px solid #2F2B3D1F',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'center',
        position: 'relative',
        transition: '0.1s',
        cursor: 'pointer'
      }}
      onClick={() => handleSelect(id)}
    >
      <Icon svg={icon} width={28} height={28} color={isSelected ? '#0553F1' : '#2F2B3DE5'} />
      <Typography fontWeight={600} textAlign='center'>
        {title}
      </Typography>
      <Typography textAlign='center'>{desc}</Typography>
      <Checkbox checked={isSelected} />

      <Chip
        label={price > 0 ? `$${price}` : t.free}
        color={!isSelected ? 'secondary' : price > 0 ? 'primary' : 'success'}
        skin='light'
        rounded
        sx={{ position: 'absolute', top: 16, right: 16 }}
      />
    </Box>
  )
}

export default DeliveryPlanCard
