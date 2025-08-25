import { alpha, Box, Pagination, PaginationItem, Typography } from '@mui/material'
import Icon from './icon/icon'
import { useLang } from 'src/providers/LanguageProvider'

interface Props {
  total: number
  totalPages: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
}

const CustomFooter = ({ total, totalPages, page, pageSize, onPageChange }: Props) => {
  const { lang } = useLang()

  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      px={5}
      py={4}
      gap={4}
      sx={{ flexDirection: { xs: 'column', md: 'row' }, borderTop: '1px solid #e6e5e7' }}
    >
      <Typography color='text.secondary' fontSize={14}>
        {lang === 'uz'
          ? `${total} ta ro'yxatdan ${page * pageSize + 1} dan ${Math.min(
              (page + 1) * pageSize,
              total
            )} gacha ko'rsatilmoqda`
          : `${total} записей из ${page * pageSize + 1} по ${Math.min((page + 1) * pageSize, total)} показаны`}
      </Typography>

      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={(_, newPage) => onPageChange(newPage - 1)}
        siblingCount={1}
        boundaryCount={1}
        renderItem={item => {
          // Skip rendering previous and next buttons
          if (item.type === 'previous' || item.type === 'next') {
            return null
          }
          return <PaginationItem {...item} />
        }}
        color='primary'
        shape='rounded'
        variant='outlined'
        sx={theme => ({
          '& .MuiPaginationItem-root': {
            border: 'none',
            backgroundColor: `#2F2B3D14 !important`,
            '&:not(.Mui-selected):hover': {
              backgroundColor: `${alpha(theme.palette.primary.main, 0.16)} !important`,
              color: theme.palette.primary.main
            }
          },
          '& .Mui-selected': {
            backgroundColor: `${theme.palette.primary.main} !important`,
            color: `${theme.palette.common.white} !important`,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark
            }
          },
          // 👇 Add styling for ellipsis buttons
          '& .MuiPaginationItem-ellipsis': {
            backgroundColor: `#2F2B3D14 !important`,
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '1rem',
            color: theme.palette.text.primary,
            cursor: 'pointer'
          }
        })}
      />
    </Box>
  )
}

export default CustomFooter
