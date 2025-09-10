import { Box, Button, Card, Checkbox, Divider, FormControlLabel, Grid, Stack, Switch, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import Title from 'src/@core/components/title'
import IRole from 'src/@core/types/role'
import { api } from 'src/configs/api'
import { useLang } from 'src/providers/LanguageProvider'

interface ActionName {
  id: number
  name: string
  code: string
  conts_id: number
  created_at: Date
  updated_at: Date
}

interface ControllerName {
  id: number
  label: string
  name: string
  created_at: Date
  updated_at: Date
}

interface Action {
  cont_id: number
  [controllerName: string]: ActionName[] | number
}

interface Permission {
  action: ActionName
  action_id: string
  actions: string
  controller: ControllerName
  conts_id: number
  id: number
  role_id: number
  created_at: Date
  updated_at: Date
}

interface Response {
  status: boolean
  data: {
    actions: Action[]
    permissions: Permission[]
    role: IRole
  }
}

const RoleView = () => {
  const [data, setData] = useState<Response | null>(null)
  const [checkAll, setCheckAll] = useState(false)
  const [checked, setChecked] = useState(false)

  const router = useRouter()
  const { t } = useLang()

  useEffect(() => {
    const fetchData = async () => {
      const idParam = router.query.id

      if (typeof idParam !== null) {
        const res = await api<Response>(`/api/permissions?role_id=${idParam}`, {
          method: 'POST'
        })
        setData(res)
      }
    }

    fetchData()
  }, [router.query])

  const handleCheckAll = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckAll(event.target.checked)
  }

  const handleChangeOne = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }
  return (
    <>
      <Stack gap={4}>
        <Stack
          sx={theme => ({
            display: 'flex',
            flexDirection: 'row',
            gap: 2
          })}
        >
          <Title title='Ruxsatlar' /> / {data?.data.role.label}
        </Stack>

        <Card sx={{ p: 5 }}>
          <Box>
            <FormControlLabel
              label='Hammasini belgilash'
              control={<Checkbox checked={checkAll} onChange={handleCheckAll} name='controlled' />}
            />
          </Box>

          <Divider />

          <Grid container spacing={2}>
            {data?.data.actions.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} lg={3} key={item.cont_id}>
                <Typography>{}</Typography>
                <FormControlLabel
                  label='Controlled'
                  control={<Switch checked={checked} onChange={handleChangeOne} />}
                />
              </Grid>
            ))}
          </Grid>

          <Divider />

          <Box sx={{ mt: 4, width: '100%', display: 'flex', justifyContent: 'end' }}>
            <Button variant='contained'>{t.save}</Button>
          </Box>
        </Card>
      </Stack>
    </>
  )
}

export default RoleView
