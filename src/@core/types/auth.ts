/**
 * Authentication types
 * Generated from Nasiya BNPL API - Authentication module
 */

import { Permission } from './employee'

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

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    token: string
    user?: CentralUser
    employee?: TenantEmployee
    merchant?: Merchant
    type: 'central' | 'tenant'
    permissions: Permission[]
  }
}

export interface CentralUser {
  id: number
  name: string
  email: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface TenantEmployee {
  id: number
  name: string
  email: string
  phone?: string
  role?: {
    id: number
    name: string
  }
  branch_id?: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Merchant {
  id: number
  name: string
  slug: string
  domain?: string
  database?: string
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
  role?: {
    id: number
    name: string
  }
}

