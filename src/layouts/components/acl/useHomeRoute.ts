import { usePermissions } from 'src/hooks/usePermissions'
import useNavigation from 'src/navigation/vertical'
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const useHomeRoute = (): string => {
  const { hasPermission } = usePermissions()
  const navigationItems = useNavigation()

  const findFirstAccessiblePath = (items: VerticalNavItemsType): string | null => {
    for (const item of items) {
      if ('sectionTitle' in item) {
        continue
      }

      if ('path' in item && item.path) {
        if (item.action && item.subject) {
          if (hasPermission(item.action, item.subject)) {
            return item.path // Found an accessible link, return its path
          }
        } else {
          return item.path
        }
      }

      if ('children' in item && item.children) {
        if (item.action && item.subject) {
          if (hasPermission(item.action, item.subject)) {
            if ('path' in item && item.path) {
              return item.path as string
            }
            const childPath = findFirstAccessiblePath(item.children as VerticalNavItemsType)
            if (childPath) {
              return childPath
            }
          }
        } else {
          const childPath = findFirstAccessiblePath(item.children as VerticalNavItemsType)
          if (childPath) {
            return childPath
          }
        }
      }
    }
    return null // No accessible path found in the current branch
  }

  const firstAccessiblePath = findFirstAccessiblePath(navigationItems)

  return firstAccessiblePath || '/login' // Fallback to login page
}

export default useHomeRoute
