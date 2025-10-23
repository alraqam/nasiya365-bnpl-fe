// ** MUI Imports
import Grid from '@mui/material/Grid'
import { Stack } from '@mui/material'
import { useLang } from 'src/providers/LanguageProvider'
import CurrentContracts from 'src/@core/components/pages/dashboard/CurrentContracts'
import DelayedContracts from 'src/@core/components/pages/dashboard/DelayedContracts'
import Stats from 'src/@core/components/pages/dashboard/Stats'
import GeneralChart from 'src/@core/components/pages/dashboard/GeneralChart'
import useFetch from 'src/hooks/useFetch'

interface Response {
  contracts: {
    this_month: number
    last_month: number
    last_month_2: number
    change: number
    expired: number
  }
  branches: number
  expected_income: number
  employees: number
}

const Home = () => {
  const { t } = useLang()

  const { data } = useFetch<Response>('/api/dashboard', true, false)

  return (
    <Stack flexDirection='column' spacing={12}>
      <Grid container spacing={7}>
        {/* Left side */}
        <Grid item xs={12} lg={6}>
          <Grid container spacing={7}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CurrentContracts contracts={data?.contracts} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <DelayedContracts
                stats={data?.contracts.expired || 0}
                chartColor='error'
                title='Revenue Generated'
                avatarIcon='tabler:credit-card'
                chartSeries={[{ data: [50, 45, 55, 50, 53] }]}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Right side */}
        <Grid item xs={12} lg={6}>
          <Grid container spacing={7}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Stats stats={data?.branches} name={t.forms.dashboard.blocks.branches} iconColor='primary' />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Stats stats={data?.expected_income} name={t.forms.dashboard.blocks.expected_income} iconColor='info' />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Stats stats={data?.employees} name={t.forms.dashboard.blocks.employees} iconColor='warning' />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Stats
                stats={data?.expected_income}
                name={t.forms.dashboard.blocks.expected_income}
                iconColor='primary'
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <GeneralChart />
    </Stack>
  )
}

export default Home
