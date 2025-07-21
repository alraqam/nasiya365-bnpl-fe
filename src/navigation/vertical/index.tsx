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
    },
    {
      title: t.pages.employees,
      path: '/employees',
      icon: 'tabler:users'
    },
    {
      title: t.pages.expenses,
      path: '/expenses',
      icon: 'tabler:exposure'
    },
    {
      title: t.pages.investment.label,
      icon: 'tabler:receipt-2',
      children: [
        {
          title: t.pages.investment.investors,
          path: '/investment/investors'
        },
        {
          title: t.pages.investment.investments,
          path: '/investment/investments'
        }
      ]
    },
    {
      title: t.pages.settings.label,
      icon: 'tabler:settings',
      children: [
        {
          title: t.pages.settings.roles,
          path: '/settings/roles'
        },
        {
          title: t.pages.settings.controllers,
          path: '/settings/controllers'
        },
        {
          title: t.pages.settings.actions,
          path: '/settings/actions'
        }
      ]
    }
  ]

  return items
}

export default useNavigation
