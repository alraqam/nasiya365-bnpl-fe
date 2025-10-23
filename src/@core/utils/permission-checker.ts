import { logger } from './logger'

export interface Permission {
  action: string
  subject: string
}

// New interface for the grouped permission format
export interface PermissionGroups {
  [subject: string]: string[]
}

// Route to Permission Mapping
export const routePermissions: Record<string, Permission> = {
  '/dashboard': { action: 'view', subject: 'clients' },
  // More on dashboard things

  '/clients': { action: 'view', subject: 'clients' },
  '/clients/create': { action: 'create', subject: 'clients' },
  '/clients/edit': { action: 'edit', subject: 'clients' },
  '/clients/[id]': { action: 'view', subject: 'clients' },

  '/orders': { action: 'view', subject: 'orders' },
  '/orders/create': { action: 'create', subject: 'orders' },
  '/orders/edit': { action: 'edit', subject: 'orders' },
  '/orders/reminder': { action: 'view', subject: 'orders' },

  '/employees': { action: 'view', subject: 'employees' },
  '/employees/create': { action: 'create', subject: 'employees' },
  '/employees/edit': { action: 'edit', subject: 'employees' },

  '/expenses': { action: 'view', subject: 'expenses' },
  '/expenses/create': { action: 'create', subject: 'expenses' },
  '/expenses/edit': { action: 'edit', subject: 'expenses' },

  '/investment/investors': { action: 'view', subject: 'investors' },
  '/investment/investors/create': { action: 'create', subject: 'investors' },
  '/investment/investors/edit': { action: 'edit', subject: 'investors' },

  '/investment/investments': { action: 'view', subject: 'investments' },
  '/investment/investments/create': { action: 'create', subject: 'investments' },
  '/investment/investments/edit': { action: 'edit', subject: 'investments' },

  '/settings/roles': { action: 'view', subject: 'roles' }
}

// Permission checker class
export class PermissionChecker {
  private permissionGroups: PermissionGroups

  constructor(permissionGroups: PermissionGroups) {
    this.permissionGroups = permissionGroups
  }

  // Check if user has a specific permission
  hasPermission(action: string, subject: string): boolean {
    const subjectPermissions = this.permissionGroups[subject]
    if (!subjectPermissions) {
      return false
    }
    return subjectPermissions.includes(action)
  }

  // Check if user has any of the given permissions
  hasAnyPermission(requiredPermissions: Permission[]): boolean {
    return requiredPermissions.some(required => this.hasPermission(required.action, required.subject))
  }

  hasAllPermissions(requiredPermissions: Permission[]): boolean {
    return requiredPermissions.every(required => this.hasPermission(required.action, required.subject))
  }

  canAccessRoute(route: string): boolean {
    const requiredPermission = this.getRoutePermission(route)
    if (!requiredPermission) {
      logger.warn(`No permission defined for route: ${route}. Allowing access.`)
      return true
    }
    return this.hasPermission(requiredPermission.action, requiredPermission.subject)
  }

  // Helper to get route permission (handles dynamic routes)
  private getRoutePermission(route: string): Permission | null {
    // Direct match first
    if (routePermissions[route]) {
      return routePermissions[route]
    }

    // Handle dynamic routes
    for (const [routePattern, permission] of Object.entries(routePermissions)) {
      if (routePattern.includes('[id]')) {
        // More flexible regex to handle both numeric and string IDs
        const regex = new RegExp('^' + routePattern.replace(/\[id\]/g, '[^/]+') + '$')
        if (regex.test(route)) {
          return permission
        }
      }

      // Handle other dynamic route patterns like [slug], [...params], etc.
      if (routePattern.includes('[')) {
        const regex = new RegExp(
          '^' +
            routePattern
              .replace(/\[\.\.\..*?\]/g, '.*') // [...params] -> .*
              .replace(/\[.*?\]/g, '[^/]+') + // [slug] -> [^/]+
            '$'
        )
        if (regex.test(route)) {
          return permission
        }
      }
    }

    return null
  }

  // Filter an array based on permissions
  filterByPermission<T>(items: T[], getRequiredPermission: (item: T) => Permission): T[] {
    return items.filter(item => {
      const required = getRequiredPermission(item)
      return this.hasPermission(required.action, required.subject)
    })
  }

  // Get all permissions for a subject
  getSubjectPermissions(subject: string): string[] {
    return this.permissionGroups[subject] || []
  }

  // Check if user has access to a subject (any permission)
  hasAccessToSubject(subject: string): boolean {
    return !!this.permissionGroups[subject] && this.permissionGroups[subject].length > 0
  }

  // Get all subjects user has access to
  getAccessibleSubjects(): string[] {
    return Object.keys(this.permissionGroups).filter(subject => this.permissionGroups[subject].length > 0)
  }
}

// Helper to merge multiple PermissionGroups into one
export const mergePermissionGroups = (groupsArray: PermissionGroups[]): PermissionGroups => {
  const merged: PermissionGroups = {}

  groupsArray.forEach(groups => {
    Object.entries(groups).forEach(([subject, actions]) => {
      if (!merged[subject]) {
        merged[subject] = []
      }
      // Merge actions and remove duplicates
      merged[subject] = [...new Set([...merged[subject], ...actions])]
    })
  })

  return merged
}

// Utility functions for easy use
export const createPermissionChecker = (permissionGroups: PermissionGroups | PermissionGroups[]) => {
  // Handle both single object and array of objects
  const groups = Array.isArray(permissionGroups) ? mergePermissionGroups(permissionGroups) : permissionGroups

  return new PermissionChecker(groups)
}

export const hasPermission = (permissionGroups: PermissionGroups, action: string, subject: string): boolean => {
  const subjectPermissions = permissionGroups[subject]
  if (!subjectPermissions) {
    return false
  }
  return subjectPermissions.includes(action)
}

export const canAccessRoute = (permissionGroups: PermissionGroups, route: string): boolean => {
  const checker = new PermissionChecker(permissionGroups)
  return checker.canAccessRoute(route)
}

// Helper to convert old Permission[] format to new PermissionGroups format
export const convertToPermissionGroups = (permissions: Permission[]): PermissionGroups => {
  const groups: PermissionGroups = {}

  permissions.forEach(permission => {
    if (!groups[permission.subject]) {
      groups[permission.subject] = []
    }
    if (!groups[permission.subject].includes(permission.action)) {
      groups[permission.subject].push(permission.action)
    }
  })

  return groups
}
