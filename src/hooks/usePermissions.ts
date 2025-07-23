import { useMemo } from 'react'
import { useAuth } from './useAuth'
import { PermissionChecker } from 'src/@core/utils/permission-checker'

export const usePermissions = () => {
  const { user, permissions } = useAuth()

  // Create permission checker instance
  const checker = useMemo(() => {
    return new PermissionChecker(permissions)
  }, [permissions])

  return {
    permissions,
    hasPermission: checker.hasPermission.bind(checker),
    hasAnyPermission: checker.hasAnyPermission.bind(checker),
    hasAllPermissions: checker.hasAllPermissions.bind(checker),
    canAccessRoute: checker.canAccessRoute.bind(checker),
    filterByPermission: checker.filterByPermission.bind(checker)
  }
}
