import { Box } from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import { styled, SxProps } from '@mui/system'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  svg: string
  width?: number
  height?: number
  styles?: SxProps<Theme> | ((theme: Theme) => SxProps<Theme>)
  color?: string
}

const Icon = ({ svg, width = 20, height = 20, styles, color = '#666666', ...props }: Props) => {
  const theme = useTheme()

  const baseStyles: SxProps<Theme> = {
    width: width,
    height: height,
    WebkitMask: `url(${svg}) no-repeat`,
    mask: `url(${svg}) no-repeat`,
    backgroundColor: color,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    WebkitMaskSize: 'contain',
    maskSize: 'contain'
  }

  const combinedStyles =
    typeof styles === 'function' ? { ...baseStyles, ...styles(theme) } : { ...baseStyles, ...styles }

  return <Box sx={combinedStyles} onClick={props.onClick} />
}

export default Icon
