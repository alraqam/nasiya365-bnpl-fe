// ** MUI Imports
import Grid from '@mui/material/Grid'
import { Stack } from '@mui/material'
import { useLang } from 'src/providers/LanguageProvider'
import CurrentContracts from 'src/@core/components/pages/dashboard/CurrentContracts'
import DelayedContracts from 'src/@core/components/pages/dashboard/DelayedContracts'
import Stats from 'src/@core/components/pages/dashboard/Stats'
import GeneralChart from 'src/@core/components/pages/dashboard/GeneralChart'

const Home = () => {
  const { t } = useLang()

  return (
    <Stack flexDirection='column' spacing={12}>
      <Grid container spacing={7}>
        {/* Left side */}
        <Grid item xs={12} lg={6}>
          <Grid container spacing={7}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CurrentContracts />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <DelayedContracts
                stats='26'
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
              <Stats stats='26' name={'Filiallar soni'} iconColor='primary' />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Stats stats='20 000 000' name={'Kutilayotgan foyda'} iconColor='info' />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Stats stats='26' name={'Xodimlar soni'} iconColor='warning' />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Stats stats='53 350 000' name={'Kutilayotgan foyda'} iconColor='primary' />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <GeneralChart />
    </Stack>
  )
}

export default Home
