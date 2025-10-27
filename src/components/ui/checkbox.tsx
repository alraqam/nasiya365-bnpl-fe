import { Box } from '@mui/material'

interface Props extends React.InputHTMLAttributes<HTMLDivElement> {
  checked: boolean
}

const Checkbox = ({ checked, ...props }: Props) => {
  return (
    <Box sx={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          width: '24px',
          height: '24px',
          backgroundColor: '#fff',
          borderRadius: '999px',
          border: checked ? '7px solid #0553F1' : '2px solid #2F2B3D66',
          transition: '0.1s',
          boxShadow: checked ? '0px 2px 6px 0px #0553F14D' : 'none',
          cursor: 'pointer'
        }}
        {...props}
      ></Box>
    </Box>
  )
}

export default Checkbox
