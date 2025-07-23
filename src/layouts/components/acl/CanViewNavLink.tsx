// ** React Imports
import { ReactNode } from 'react'

// ** Hook Imports
import { usePermissions } from 'src/hooks/usePermissions' // Import your usePermissions hook

// ** Types
import { NavLink } from 'src/@core/layouts/types'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props

  // ** Hook
  const { hasPermission } = usePermissions() // Use your custom hook

  if (navLink && navLink.auth === false) {
    return <>{children}</>
  } else {
    // Only render if navLink exists and the user has permission (if action/subject are defined)
    // If action/subject are NOT defined, assume it's publicly visible (or adjust policy as needed)
    return navLink && (navLink.action && navLink.subject ? hasPermission(navLink.action, navLink.subject) : true) ? (
      <>{children}</>
    ) : null
  }
}

export default CanViewNavLink
