import { styled } from '@mui/system'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  svg: string
  width?: number
  height?: number
  styles?: { [key: string]: string }
  color?: string
}

const CustomIcon = styled('div')<React.HTMLAttributes<HTMLDivElement>>(({ theme }) => ({}))

const Icon = ({ svg, width = 50, height = 50, styles, color = '#666666', ...props }: Props) => {
  return (
    <CustomIcon
      sx={{
        width: width,
        height: height,
        WebkitMask: `url(${svg})`,
        mask: `url(${svg}) no-repeat`,
        backgroundColor: color,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        ...(styles || {})
      }}
      onClick={props.onClick}
    ></CustomIcon>
  )
}

export default Icon
