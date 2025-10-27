/**
 * Permission Transformer Utility
 * Converts between API format and internal format
 */

import { Permission } from './permission-checker'

/**
 * API format: Record<string, string[]>
 * Example: { "orders": ["view", "create", "edit"], "clients": ["view"] }
 */
export type PermissionsMap = Record<string, string[]>

/**
 * Converts API permission format to internal Permission[] format
 * @param permissionsMap - Permissions in API format (nested object)
 * @returns Array of Permission objects with action and subject
 */
export function transformApiPermissions(permissionsMap: PermissionsMap): Permission[] {
  const permissions: Permission[] = []
  
  for (const [subject, actions] of Object.entries(permissionsMap)) {
    for (const action of actions) {
      permissions.push({
        action,
        subject
      })
    }
  }
  
  return permissions
}

/**
 * Converts internal Permission[] format to API format (if needed)
 * @param permissions - Array of Permission objects
 * @returns Permissions in API format (nested object)
 */
export function transformToApiFormat(permissions: Permission[]): PermissionsMap {
  const permissionsMap: PermissionsMap = {}
  
  for (const permission of permissions) {
    if (!permissionsMap[permission.subject]) {
      permissionsMap[permission.subject] = []
    }
    if (!permissionsMap[permission.subject].includes(permission.action)) {
      permissionsMap[permission.subject].push(permission.action)
    }
  }
  
  return permissionsMap
}

/**
 * Checks if a permission exists in the API format
 * @param permissionsMap - Permissions in API format
 * @param action - Action to check
 * @param subject - Subject/resource to check
 * @returns True if permission exists
 */
export function hasPermissionInMap(
  permissionsMap: PermissionsMap,
  action: string,
  subject: string
): boolean {
  return permissionsMap[subject]?.includes(action) ?? false
}

/**
 * Get all actions for a subject from API format
 * @param permissionsMap - Permissions in API format
 * @param subject - Subject/resource to get actions for
 * @returns Array of action strings
 */
export function getActionsForSubject(
  permissionsMap: PermissionsMap,
  subject: string
): string[] {
  return permissionsMap[subject] ?? []
}

/**
 * Get all subjects from API format
 * @param permissionsMap - Permissions in API format
 * @returns Array of subject strings
 */
export function getAllSubjects(permissionsMap: PermissionsMap): string[] {
  return Object.keys(permissionsMap)
}

