// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useLang } from 'src/providers/LanguageProvider'

const useNavigation = (): VerticalNavItemsType => {
  const { t } = useLang()

  const items = [
    {
      title: t.pages.dashboard,
      path: '/dashboard',
      icon: 'tabler:brand-speedtest',
      action: 'index',
      subject: 'DashboardController'
    },
    {
      title: t.pages.clients,
      path: '/clients',
      icon: 'tabler:users-group',
      action: 'index',
      subject: 'ClientController'
    },
    {
      title: t.pages.products,
      path: '/products',
      icon: 'tabler:cube',
      action: 'index',
      subject: 'DeviceController'
    },
    {
      title: t.pages.orders,
      path: '/orders',
      icon: 'tabler:shopping-cart',
      action: 'index',
      subject: 'OrderController'
    },
    {
      title: t.pages.employees,
      path: '/employees',
      icon: 'tabler:users',
      action: 'index',
      subject: 'AdminController'
    },
    {
      title: t.pages.expenses,
      path: '/expenses',
      icon: 'tabler:exposure',
      action: 'index',
      subject: 'CostController'
    },
    {
      title: t.pages.investment.label,
      icon: 'tabler:receipt-2',
      children: [
        {
          title: t.pages.investment.investors,
          path: '/investment/investors',
          action: 'index',
          subject: 'InvestorController'
        },
        {
          title: t.pages.investment.investments,
          path: '/investment/investments',
          action: 'index',
          subject: 'InvestmentController'
        }
      ]
    },
    {
      title: t.pages.settings.label,
      icon: 'tabler:settings',
      children: [
        {
          title: t.pages.settings.roles,
          path: '/settings/roles',
          action: 'index',
          subject: 'Mirfozil'
        },
        {
          title: t.pages.settings.controllers,
          path: '/settings/controllers',
          action: 'index',
          subject: 'Mirfozil'
        },
        {
          title: t.pages.settings.actions,
          path: '/settings/actions',
          action: 'index',
          subject: 'Mirfozil'
        }
      ]
    }
  ]

  return items
}

export default useNavigation
