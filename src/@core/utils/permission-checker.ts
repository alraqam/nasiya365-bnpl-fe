import { logger } from './logger'

export interface Permission {
  action: string
  subject: string
}

// Route to Permission Mapping
export const routePermissions: Record<string, Permission> = {
  '/dashboard': { action: 'view', subject: 'clients' },
  // More on dashboard things

  '/clients': { action: 'view', subject: 'clients' },
  '/clients/create': { action: 'store', subject: 'clients' },
  '/clients/edit': { action: 'updateClient', subject: 'clients' },
  '/clients/[id]': { action: 'show', subject: 'clients' },

  '/orders': { action: 'view', subject: 'orders' },
  '/orders/create': { action: 'post_createOrder', subject: 'orders' },
  '/orders/edit': { action: 'putUpdateOrder', subject: 'orders' },
  '/orders/reminder': { action: 'get_notes', subject: 'orders' },

  '/employees': { action: 'view', subject: 'employees' },
  '/employees/create': { action: 'store', subject: 'employees' },
  '/employees/edit': { action: 'update', subject: 'employees' },

  '/expenses': { action: 'view', subject: 'orders' },
  '/expenses/create': { action: 'store', subject: 'orders' },
  '/expenses/edit': { action: 'update', subject: 'orders' },

  '/investment/investors': { action: 'view', subject: 'investors' },
  '/investment/investors/create': { action: 'store', subject: 'investors' },
  '/investment/investors/edit': { action: 'update', subject: 'investors' },

  '/investment/investments': { action: 'view', subject: 'investments' },
  '/investment/investments/create': { action: 'store', subject: 'investments' },
  '/investment/investments/edit': { action: 'update', subject: 'investments' },

  '/settings/roles': { action: 'view', subject: 'roles' }
}

// Permission checker class
export class PermissionChecker {
  private permissions: Permission[]

  constructor(permissions: Permission[]) {
    this.permissions = permissions
  }

  // Check if user has a specific permission
  hasPermission(action: string, subject: string): boolean {
    return this.permissions.some(permission => permission.action === action && permission.subject === subject)
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
}

// Utility functions for easy use
export const createPermissionChecker = (permissions: Permission[]) => {
  return new PermissionChecker(permissions)
}

export const hasPermission = (permissions: Permission[], action: string, subject: string): boolean => {
  return permissions.some(p => p.action === action && p.subject === subject)
}

export const canAccessRoute = (permissions: Permission[], route: string): boolean => {
  const checker = new PermissionChecker(permissions)
  return checker.canAccessRoute(route)
}
