/**
 * Authentication Service
 * Handles authentication for both Central and Employee logins
 * Generated from Nasiya BNPL API - Authentication module
 */

import { api } from 'src/configs/api'
<<<<<<< HEAD
import {
  LoginRequest,
  RegisterRequest,
  AuthUser,
  CentralLoginResponse,
  EmployeeLoginResponse
} from 'src/@core/types/auth'
=======
import { LoginRequest, LoginResponse, TransformedLoginResponse, RegisterRequest, AuthUser } from 'src/@core/types/auth'
import { transformApiPermissions } from 'src/@core/utils/permission-transformer'
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)

export const authService = {
  /**
   * Central user login
   */
<<<<<<< HEAD
  centralLogin: (credentials: LoginRequest) =>
    api<CentralLoginResponse>('/api/central/login', {
=======
  centralLogin: async (credentials: LoginRequest): Promise<TransformedLoginResponse> => {
    const response = await api<LoginResponse>('/api/central/login', {
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    
    // Transform permissions from API format to internal format
    // Check both data.permission_groups and data.user.permission_groups
    const permissionGroups = (response.data?.user as any)?.permission_groups || response.data?.permission_groups
    const transformedPermissions = permissionGroups 
      ? transformApiPermissions(permissionGroups)
      : []
      
    return {
      ...response,
      data: {
        ...response.data,
        permissions: transformedPermissions
      }
    } as TransformedLoginResponse
  },

  /**
   * Central user registration
   */
<<<<<<< HEAD
  centralRegister: (data: RegisterRequest) =>
    api<CentralLoginResponse>('/api/central/register', {
=======
  centralRegister: async (data: RegisterRequest): Promise<TransformedLoginResponse> => {
    const response = await api<LoginResponse>('/api/central/register', {
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)
      method: 'POST',
      body: JSON.stringify(data)
    })
    
    // Transform permissions from API format to internal format
    // Check both data.permission_groups and data.user.permission_groups
    const permissionGroups = (response.data?.user as any)?.permission_groups || response.data?.permission_groups
    const transformedPermissions = permissionGroups 
      ? transformApiPermissions(permissionGroups)
      : []
      
    return {
      ...response,
      data: {
        ...response.data,
        permissions: transformedPermissions
      }
    } as TransformedLoginResponse
  },

  /**
   * Central user logout
   */
  centralLogout: () =>
    api('/api/central/logout', {
      method: 'POST'
    }),

  /**
   * Employee login with tenant schema
   */
<<<<<<< HEAD
  employeeLogin: (credentials: LoginRequest) =>
    api<EmployeeLoginResponse>(`/api/employee/login`, {
=======
  employeeLogin: async (credentials: LoginRequest & { company_schema: string }): Promise<TransformedLoginResponse> => {
    const response = await api<LoginResponse>(`/api/employee/login`, {
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)
      method: 'POST',
      headers: {
        'X-Tenant-ID': credentials.company_schema,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: credentials.phone,
        password: credentials.password
<<<<<<< HEAD
      }),
      headers: {
        'X-Tenant-ID': 'demo'
      }
    }),
=======
      })
    })
    
    // Transform permissions from API format to internal format
    // Permission groups are nested inside the employee object
    const permissionGroups = (response.data?.employee as any)?.permission_groups || response.data?.permission_groups
    const transformedPermissions = permissionGroups 
      ? transformApiPermissions(permissionGroups)
      : []
      
    return {
      ...response,
      data: {
        ...response.data,
        permissions: transformedPermissions
      }
    } as TransformedLoginResponse
  },
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)

  /**
   * Employee logout
   */
  employeeLogout: () =>
    api('/api/employee/logout', {
      method: 'POST'
    }),

  /**
   * Get current employee details
   */
  employeeMe: () =>
    api<{ data: AuthUser }>('/api/employee/me', {
      method: 'GET'
    }),

  /**
   * Get current central user details
   */
  centralMe: () =>
    api<{ data: AuthUser }>('/api/central/me', {
      method: 'GET'
    })
}
