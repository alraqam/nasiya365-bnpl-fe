// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { t } from 'i18next'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: t('pages.dashboard'),
      path: '/dashboard',
      icon: 'tabler:brand-speedtest'
    },
    {
      title: t('pages.clients'),
      path: '/clients',
      icon: 'tabler:users-group'
    },
    {
      title: t('pages.products'),
      path: '/products',
      icon: 'tabler:cube'
    },
    {
      title: t('pages.orders'),
      path: '/orders',
      icon: 'tabler:shopping-cart'
    }
  ]
}

export default navigation
