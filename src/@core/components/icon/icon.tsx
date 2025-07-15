import { Theme, useTheme } from '@mui/material/styles'
import { styled, SxProps } from '@mui/system'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  svg: string
  width?: number
  height?: number
  styles?: ((theme: Theme) => { [key: string]: string }) | { [key: string]: string }
  color?: string
}

const CustomIcon = styled('div')<React.HTMLAttributes<HTMLDivElement>>(({ theme }) => ({}))

const Icon = ({ svg, width = 20, height = 20, styles, color = '#666666', ...props }: Props) => {
  const theme = useTheme()
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
        ...(typeof styles === 'function' ? styles(theme) : styles)
      }}
      onClick={props.onClick}
    ></CustomIcon>
  )
}

export default Icon
