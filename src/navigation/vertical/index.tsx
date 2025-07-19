// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useLang } from 'src/providers/LanguageProvider'

const useNavigation = (): VerticalNavItemsType => {
  const { t } = useLang()

  const items = [
    {
      title: t.pages.dashboard,
      path: '/dashboard',
      icon: 'tabler:brand-speedtest'
    },
    {
      title: t.pages.clients,
      path: '/clients',
      icon: 'tabler:users-group'
    },
    {
      title: t.pages.products,
      path: '/products',
      icon: 'tabler:cube'
    },
    {
      title: t.pages.orders,
      path: '/orders',
      icon: 'tabler:shopping-cart'
    }
  ]

  return items
}

export default useNavigation
