// ** React Imports
import { ReactNode } from 'react'

// ** Hook Imports
import { usePermissions } from 'src/hooks/usePermissions' // Import your usePermissions hook

// ** Types
import { NavSectionTitle } from 'src/@core/layouts/types'

interface Props {
  children: ReactNode
  navTitle?: NavSectionTitle
}

const CanViewNavSectionTitle = (props: Props) => {
  // ** Props
  const { children, navTitle } = props

  // ** Hook
  const { hasPermission } = usePermissions() // Use your custom hook

  if (navTitle && navTitle.auth === false) {
    return <>{children}</>
  } else {
    // Only render if navTitle exists and the user has permission (if action/subject are defined)
    // If action/subject are NOT defined, assume it's publicly visible (or adjust policy as needed)
    return navTitle &&
      (navTitle.action && navTitle.subject ? hasPermission(navTitle.action, navTitle.subject) : true) ? (
      <>{children}</>
    ) : null
  }
}

export default CanViewNavSectionTitle
