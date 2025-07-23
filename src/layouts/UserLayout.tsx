// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'

// ** Navigation Imports
import useNavigation from 'src/navigation/vertical'
import HorizontalNavItems from 'src/navigation/horizontal'

// ** Component Import
import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { usePermissions } from 'src/hooks/usePermissions' // Import your usePermissions hook

// ** Type Import
import { NavLink, NavGroup, NavSectionTitle, VerticalNavItemsType } from 'src/@core/layouts/types' // Import all necessary types
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  children: ReactNode
  contentHeightFixed?: boolean
}

const UserLayout = ({ children, contentHeightFixed }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const allNavItems = useNavigation() // Get all navigation items
  const { hasPermission } = usePermissions() // Get your permission checker
  const { permissions: userPermissions, user } = useAuth() // Get user and permissions from AuthContext

  const filterNavItems = (items: VerticalNavItemsType): VerticalNavItemsType => {
    return items.filter(item => {
      // Handle NavSectionTitle (section headers)
      if ('sectionTitle' in item) {
        return true // Section titles are typically always visible and not permission-controlled
      }

      // If the item is a group with children (NavGroup)
      if ('children' in item && item.children) {
        const filteredChildren = filterNavItems(item.children) // Recursively filter children

        const hasDirectPermission = item.action && item.subject && hasPermission(item.action, item.subject)

        if (hasDirectPermission || filteredChildren.length > 0) {
          ;(item as NavGroup).children = filteredChildren as (NavLink | NavGroup)[]
          return true
        }
        return false // Hide group if no direct permission and no visible children
      }

      if ('action' in item && 'subject' in item && item.action && item.subject) {
        const hasAccess = hasPermission(item.action, item.subject)
        return hasAccess // Only show if user has permission
      }

      return true
    })
  }

  // Filter the navigation items based on permissions
  const filteredNavItems = filterNavItems(allNavItems)

  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems: filteredNavItems // Pass the filtered items here
          // Uncomment the below line when using server-side menu in vertical layout and comment the above line
          // navItems: verticalMenuItems
        },
        appBar: {
          content: props => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          )
        }
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: HorizontalNavItems() // You might need to filter HorizontalNavItems similarly
            // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
            // navItems: horizontalMenuItems
          },
          appBar: {
            content: () => <HorizontalAppBarContent settings={settings} saveSettings={saveSettings} />
          }
        }
      })}
    >
      {children}
    </Layout>
  )
}

export default UserLayout
