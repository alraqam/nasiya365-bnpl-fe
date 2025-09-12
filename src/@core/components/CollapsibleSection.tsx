'use client'
import * as React from 'react'
import { Box, Collapse, Card, CardContent, Typography } from '@mui/material'
import { SxProps } from '@mui/system'
import { Icon } from '@iconify/react'

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  contentSx?: SxProps // 👈 For custom styles inside Collapse
  cardSx?: SxProps // 👈 For styling the entire Card if needed
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  contentSx,
  cardSx
}: CollapsibleSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  const handleToggle = () => {
    setOpen(prev => !prev)
  }

  return (
    <Card sx={{ boxShadow: 3, ...cardSx }}>
      <CardContent sx={{ padding: 0, pb: '0px !important', cursor: 'pointer' }}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          // sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'primary.main' } }}
          sx={{ padding: 6 }}
          onClick={handleToggle}
        >
          <Typography variant='h6'>{title}</Typography>
          <Icon icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'} fontSize={20} />
        </Box>

        <Collapse in={open} timeout='auto' unmountOnExit>
          <Box sx={{ ...contentSx, padding: 6, paddingTop: 0 }}>{children}</Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}
