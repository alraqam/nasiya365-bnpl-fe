// ** React Imports
import { ReactNode } from 'react'

// ** Hook Imports
import { usePermissions } from 'src/hooks/usePermissions' // Import your usePermissions hook

// ** Types
import { NavGroup, NavLink } from 'src/@core/layouts/types'

interface Props {
  navGroup?: NavGroup
  children: ReactNode
}

const CanViewNavGroup = (props: Props) => {
  // ** Props
  const { children, navGroup } = props

  // ** Hook
  const { hasPermission } = usePermissions() // Use your custom hook

  const checkForVisibleChild = (arr: (NavLink | NavGroup)[]): boolean => {
    return arr.some((i: NavLink | NavGroup) => {
      // If it's a NavGroup with children, recurse
      if ('children' in i && i.children) {
        return checkForVisibleChild(i.children)
      } else {
        // If it's a NavLink (or a NavGroup without children, though less common for this check)
        // Check if it has action/subject and if the user has permission
        return i.action && i.subject ? hasPermission(i.action, i.subject) : true // Default to true if no permission defined
      }
    })
  }

  const canViewMenuGroup = (item: NavGroup) => {
    const hasAnyVisibleChild = item.children && checkForVisibleChild(item.children)

    // If the group itself doesn't have explicit action/subject, its visibility depends solely on its children
    if (!(item.action && item.subject)) {
      return hasAnyVisibleChild
    }

    // If the group has explicit action/subject, it must have permission AND at least one visible child
    return hasPermission(item.action, item.subject) && hasAnyVisibleChild
  }

  if (navGroup && navGroup.auth === false) {
    return <>{children}</>
  } else {
    // Only render if navGroup exists and the user can view it
    return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null
  }
}

export default CanViewNavGroup
