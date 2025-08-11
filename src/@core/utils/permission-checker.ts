export interface Permission {
  action: string
  subject: string
}

// Route to Permission Mapping
export const routePermissions: Record<string, Permission> = {
  '/dashboard': { action: 'index', subject: 'DashboardController' },
  // More on dashboard things

  '/clients': { action: 'index', subject: 'ClientController' },
  '/clients/create': { action: 'store', subject: 'ClientController' },
  '/clients/edit': { action: 'updateClient', subject: 'ClientController' },
  '/clients/[id]': { action: 'show', subject: 'ClientController' },

  '/products': { action: 'index', subject: 'DeviceController' },
  '/products/create': { action: 'store', subject: 'DeviceController' },
  '/products/edit': { action: 'update', subject: 'DeviceController' },

  '/orders': { action: 'index', subject: 'OrderController' },
  '/orders/create': { action: 'post_createOrder', subject: 'OrderController' },
  '/orders/edit': { action: 'putUpdateOrder', subject: 'OrderController' },
  '/orders/reminder': { action: 'get_notes', subject: 'OrderController' },

  '/employees': { action: 'index', subject: 'AdminController' },
  '/employees/create': { action: 'store', subject: 'AdminController' },
  '/employees/edit': { action: 'update', subject: 'AdminController' },

  '/expenses': { action: 'index', subject: 'CostController' },
  '/expenses/create': { action: 'store', subject: 'CostController' },
  '/expenses/edit': { action: 'update', subject: 'CostController' },

  '/investment/investors': { action: 'index', subject: 'InvestorController' },
  '/investment/investors/create': { action: 'store', subject: 'InvestorController' },
  '/investment/investors/edit': { action: 'update', subject: 'InvestorController' },

  '/investment/investments': { action: 'index', subject: 'InvestmentController' },
  '/investment/investments/create': { action: 'store', subject: 'InvestmentController' },
  '/investment/investments/edit': { action: 'update', subject: 'InvestmentController' },

  '/settings/roles': { action: 'index', subject: 'Mirfozil' },
  '/settings/controllers': { action: 'index', subject: 'Mirfozil' },
  '/settings/actions': { action: 'index', subject: 'Mirfozil' }
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

  // Check if user has all of the given permissions
  hasAllPermissions(requiredPermissions: Permission[]): boolean {
    return requiredPermissions.every(required => this.hasPermission(required.action, required.subject))
  }

  // Get permission for a specific route
  canAccessRoute(route: string): boolean {
    const requiredPermission = this.getRoutePermission(route)
    if (!requiredPermission) {
      // OPTION 1: Allow access if no permission is defined (more permissive)
      console.warn(`No permission defined for route: ${route}. Allowing access.`)
      return true

      // OPTION 2: Deny access if no permission is defined (more restrictive)
      // console.warn(`No permission defined for route: ${route}. Denying access.`)
      // return false
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
