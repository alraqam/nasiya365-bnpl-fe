// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { t } from 'i18next'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: t('pages.dashboard'),
      path: '/dashboard',
      icon: 'tabler:dashboard'
    },
    {
      title: t('pages.clients'),
      path: '/clients',
      icon: 'tabler:users-group'
    }
  ]
}

export default navigation
