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
      sectionTitle: t['nav-blocks'].main
    },
    {
      title: t.pages.clients,
      path: '/clients',
      icon: 'tabler:users-group',
      action: 'index',
      subject: 'ClientController'
    },
    {
      title: t.pages.warehouse,
      icon: 'tabler:building-cottage',
      children: [
        {
          title: t.pages.list,
          path: '/warehouse/list',
          action: 'index',
          subject: 'InvestorController'
        },
        {
          title: t.pages.categories,
          path: '/warehouse/categories',
          action: 'index',
          subject: 'InvestorController'
        },
        {
          title: t.pages.providers,
          path: '/warehouse/providers',
          action: 'index',
          subject: 'InvestorController'
        }
      ]
    },
    {
      title: t.pages.orders,
      path: '/orders',
      icon: 'tabler:shopping-cart',
      action: 'index',
      subject: 'OrderController'
    },
    {
      title: t.pages.expenses,
      path: '/expenses',
      icon: 'tabler:exposure',
      action: 'index',
      subject: 'CostController'
    },
    {
      title: t.pages.checkout,
      path: '/checkout',
      icon: 'tabler:device-desktop',
      action: 'index',
      subject: 'CostController'
    },
    {
      sectionTitle: t['nav-blocks'].control
    },
    {
      title: t.pages.branches,
      path: '/branches',
      icon: 'tabler:hierarchy',
      action: 'index',
      subject: 'AdminController'
    },
    {
      title: t.pages.employees,
      path: '/employees',
      icon: 'tabler:users',
      action: 'index',
      subject: 'AdminController'
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
        }
      ]
    }
  ]

  return items
}

export default useNavigation
