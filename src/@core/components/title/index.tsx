import { styled } from '@mui/material/styles'
import Icon from '../icon/icon'
import { Box, BoxProps } from '@mui/material'

interface Props extends BoxProps {
  title: string
  color?: string
}

const TitleWrapper = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main
}))

const Title = ({ title, color = '#0553F1', ...rest }: Props) => {
  return (
    <TitleWrapper className='page-title' {...rest}>
      <Icon svg='/icons/star-s-fill.svg' width={20} height={20} color={color} /> {title}
    </TitleWrapper>
  )
}

export default Title
