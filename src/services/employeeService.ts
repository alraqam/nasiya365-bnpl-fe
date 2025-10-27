/**
 * Employee Service
 * Handles all employee management operations
 * Generated from Nasiya BNPL API - Employee Management module
 */

import { api, apiClient } from 'src/configs/api'
import {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  UpdateEmployeePasswordRequest,
  AssignRoleRequest,
  AssignBranchRequest,
  EmployeeQueryParams,
  Role,
  Permission
} from 'src/@core/types/employee'
import { PaginatedResponse } from 'src/@core/types/api'

export const employeeService = {
  /**
   * Get all employees with pagination
   */
  getAll: (params?: EmployeeQueryParams) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.per_page) query.append('per_page', params.per_page.toString())
    if (params?.search) query.append('search', params.search)
    if (params?.status) query.append('status', params.status)
    if (params?.branch_id) query.append('branch_id', params.branch_id.toString())
    if (params?.role_id) query.append('role_id', params.role_id.toString())

    const queryString = query.toString()
    return api<PaginatedResponse<Employee>>(
      `/api/employees${queryString ? '?' + queryString : ''}`
    )
  },

  /**
   * Get a single employee by ID
   */
  getById: (id: number) =>
    api<{ data: Employee }>(`/api/employees/${id}`),

  /**
   * Create a new employee
   */
  create: (data: CreateEmployeeRequest) =>
    apiClient.post<{ data: Employee }>('/api/employees', data),

  /**
   * Update an existing employee
   */
  update: (id: number, data: UpdateEmployeeRequest) =>
    apiClient.put<{ data: Employee }>(`/api/employees/${id}`, data),

  /**
   * Delete an employee
   */
  delete: (id: number) =>
    apiClient.delete(`/api/employees/${id}`),

  /**
   * Activate an employee
   */
  activate: (id: number) =>
    apiClient.post(`/api/employees/${id}/activate`),

  /**
   * Deactivate an employee
   */
  deactivate: (id: number) =>
    apiClient.post(`/api/employees/${id}/deactivate`),

  /**
   * Assign a role to an employee
   */
  assignRole: (id: number, data: AssignRoleRequest) =>
    apiClient.post(`/api/employees/${id}/assign-role`, data),

  /**
   * Remove a role from an employee
   */
  removeRole: (id: number, roleId: number) =>
    apiClient.delete(`/api/employees/${id}/remove-role/${roleId}`),

  /**
   * Assign an employee to a branch
   */
  assignBranch: (id: number, data: AssignBranchRequest) =>
    apiClient.post(`/api/employees/${id}/assign-branch`, data),

  /**
   * Update employee password
   */
  updatePassword: (id: number, data: UpdateEmployeePasswordRequest) =>
    apiClient.put(`/api/employees/${id}/update-password`, data),

  /**
   * Get employee roles
   */
  getRoles: (id: number) =>
    api<{ data: Role[] }>(`/api/employees/${id}/roles`),

  /**
   * Get employee permissions
   */
  getPermissions: (id: number) =>
    api<{ data: Permission[] }>(`/api/employees/${id}/permissions`)
}


