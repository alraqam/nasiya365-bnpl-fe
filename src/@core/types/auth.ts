/**
 * Authentication types
 * Generated from Nasiya BNPL API - Authentication module
 */

import { PermissionGroups } from '../utils/permission-checker'
import { Permission } from './employee'
import { CentralUser, TenantUser } from 'src/context/types'
import { PermissionsMap } from 'src/@core/utils/permission-transformer'

export interface LoginRequest {
  email?: string
  phone?: string
  password: string
  company_schema?: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
}

<<<<<<< HEAD
export interface CentralLoginResponse {
=======
export interface LoginResponse {
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)
  status: boolean
  message: string
  data: {
    token: string
<<<<<<< HEAD
    token_type: string
    user: CentralUser & {
      roles: {
        id: number
        name: string
        guard_name: string
      }
      permissions: Permission[]
      permission_groups: PermissionGroups[]
    }
  }
}

export interface EmployeeLoginResponse {
  status: boolean
  message: string
  data: {
    token: string
    token_type: string
    employee: TenantEmployee & {
      roles: {
        id: string
        name: string
        guard_name: string
      }
      permissions: Permission[]
      permission_groups: PermissionGroups[]
    }
    tenant: {
      id: number
      name: string
      subdomain: string
    }
=======
    user?: CentralUser
    employee?: TenantUser
    tenant?: Tenant
    type: 'central' | 'tenant'
    permission_groups: PermissionsMap // API format: Record<string, string[]>
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)
  }
  errors?: Record<string, string[]>
}

<<<<<<< HEAD
export interface CentralUser {
  id: number
  name: string
  surname: string
  middle_name: null | string
  email: null | string
  phone1: string
  phone2: null | string
  email_verified_at: null | string
  passport: string
  place_of_issue: null | string
  date_of_issue: null | string
  date_of_birth: string
  gender: number
  place_of_birth: null | string
  place_of_residence: null | string
  family_status: null | string
  number_of_children: null | string
  status: number
  created_at: string
  updated_at: string
  role_id: number
  role: {
    id: number
    name: string
    label: string
    created_at: string
    updated_at: string
  }
}

export interface TenantEmployee {
  id: number
  name: string
  sur_name: string
  phone: string
  email: string
  photo: null | string
  is_active: boolean
  created_at: Date
  updated_at: Date
=======
// Transformed response with permissions converted to internal format
export interface TransformedLoginResponse {
  status: boolean
  message: string
  data: {
    token: string
    user?: CentralUser
    employee?: TenantUser
    tenant?: Tenant
    type: 'central' | 'tenant'
    permissions: Permission[] // Internal format: Array of {action, subject}
  }
  errors?: Record<string, string[]>
  success?: boolean
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)
}

export interface Merchant {
  id: number
  name: string
  logo: null | string
  domain: string
  subdomain: string
  colors: string
  user_id: number
  schema_name: string
  merchant_uid: string
  billing_id: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

<<<<<<< HEAD
export type User = CentralUser | TenantEmployee
export type UserType = 'central' | 'tenant'
=======
export interface Tenant {
  id: number
  name: string
  subdomain: string
}
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)

export interface AuthUser {
  id: number
  name: string
  email: string
  role?: {
    id: number
    name: string
  }
}
