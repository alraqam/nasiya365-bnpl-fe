/**
 * Employee types
 * Generated from Nasiya BNPL API - Employee Management module
 */

export interface Employee {
  id: number
  name: string
  email: string
  phone?: string
  role?: Role
  branch_id?: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Role {
  id: number
  name: string
  description?: string
  permissions?: Permission[]
}

export interface Permission {
  action: string
  subject: string
}

export interface CreateEmployeeRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  role_id?: number
  branch_id?: number
}

export interface UpdateEmployeeRequest {
  name?: string
  email?: string
  phone?: string
  role_id?: number
  branch_id?: number
}

export interface UpdateEmployeePasswordRequest {
  current_password: string
  password: string
  password_confirmation: string
}

export interface AssignRoleRequest {
  role_id: number
}

export interface AssignBranchRequest {
  branch_id: number
}

export interface EmployeeQueryParams {
  page?: number
  per_page?: number
  search?: string
  status?: 'active' | 'inactive'
  branch_id?: number
  role_id?: number
}
