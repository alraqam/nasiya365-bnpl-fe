import { alpha, Box, Pagination, PaginationItem, Typography } from '@mui/material'
import Icon from './icon/icon'
import { useLang } from 'src/providers/LanguageProvider'

interface Props {
  rowCount: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
}

const CustomFooter = ({ rowCount, page, pageSize, onPageChange }: Props) => {
  const totalPages = Math.ceil(rowCount / pageSize)

  const { lang } = useLang()

  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      px={5}
      py={6}
      gap={4}
      sx={{ flexDirection: { xs: 'column', md: 'row' } }}
    >
      <Typography color='text.secondary' fontSize={14}>
        {lang === 'uz'
          ? `${rowCount} ta ro'yxatdan ${page * pageSize + 1} dan ${Math.min(
              (page + 1) * pageSize,
              rowCount
            )} gacha ko'rsatilmoqda`
          : `${rowCount} записей из ${page * pageSize + 1} по ${Math.min((page + 1) * pageSize, rowCount)} показаны`}
      </Typography>

      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={(_, newPage) => onPageChange(newPage - 1)}
        siblingCount={1}
        boundaryCount={1}
        showFirstButton
        showLastButton
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
        renderItem={item => (
          <PaginationItem
            components={{
              first: () => <Icon svg='/icons/first-page.svg' color='#000' />,
              last: () => <Icon svg='/icons/last-page.svg' color='#000' />
            }}
            {...item}
          />
        )}
      />
    </Box>
  )
}

export default CustomFooter
