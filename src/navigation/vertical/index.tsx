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
      action: 'view',
      subject: 'reports'
    },
    {
      sectionTitle: t['nav-blocks'].main
    },
    {
      title: t.pages.clients,
      path: '/clients',
      icon: 'tabler:users-group',
      action: 'view',
      subject: 'clients'
    },
    {
      title: t.pages.warehouse,
      icon: 'tabler:building-cottage',
      children: [
        {
          title: t.pages.products,
          path: '/warehouse/list',
          action: 'view',
          subject: 'products'
        },
        {
          title: t.pages.categories,
          path: '/warehouse/categories',
          action: 'view',
          subject: 'categories'
        },
        {
          title: t.pages.providers,
          path: '/warehouse/providers',
          action: 'view',
          subject: 'warehouses'
        }
      ]
    },
    {
      title: t.pages.orders,
      path: '/orders',
      icon: 'tabler:shopping-cart',
      action: 'view',
      subject: 'orders'
    },
    {
      title: t.pages.expenses,
      path: '/expenses',
      icon: 'tabler:exposure',
      action: 'view',
      subject: 'expenses'
    },
    {
      title: t.pages.checkout,
      path: '/checkout',
      icon: 'tabler:device-desktop',
      action: 'create',
      subject: 'orders'
    },
    {
      sectionTitle: t['nav-blocks'].control
    },
    {
      title: t.pages.branches,
      path: '/branches',
      icon: 'tabler:hierarchy',
      action: 'view',
      subject: 'branches'
    },
    {
      title: t.pages.employees,
      path: '/employees',
      icon: 'tabler:users',
      action: 'view',
      subject: 'employees'
    },
    {
      title: t.pages.investment.label,
      icon: 'tabler:receipt-2',
      children: [
        {
          title: t.pages.investment.investors,
          path: '/investment/investors',
          action: 'view',
          subject: 'investors'
        },
        {
          title: t.pages.investment.investments,
          path: '/investment/investments',
          action: 'view',
          subject: 'investments'
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
          action: 'view',
          subject: 'roles'
        }
      ]
    }
  ]

  return items
}

export default useNavigation
