/**
 * Employee Service
 * Handles all employee management operations
 * Generated from Nasiya BNPL API - Employee Management module
 */

import { api, apiClient } from 'src/configs/api'
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, EmployeeQueryParams } from 'src/@core/types/employee'
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

    const queryString = query.toString()
    return api<PaginatedResponse<Employee>>(`/api/employees${queryString ? '?' + queryString : ''}`)
  },

  /**
   * Get a single employee by ID
   */
  getById: (id: number) => api<{ data: Employee }>(`/api/employees/${id}`),

  /**
   * Create a new employee
   */
  create: (data: CreateEmployeeRequest) => apiClient.post<{ data: Employee }>('/api/employees', data),

  /**
   * Update an existing employee
   */
  update: (id: number, data: UpdateEmployeeRequest) => apiClient.put<{ data: Employee }>(`/api/employees/${id}`, data),

  /**
   * Delete an employee
   */
  delete: (id: number) => apiClient.delete(`/api/employees/${id}`),

  /**
   * Search employees
   */
  search: (searchTerm: string, params?: Omit<EmployeeQueryParams, 'search'>) =>
    employeeService.getAll({ ...params, search: searchTerm })
}


