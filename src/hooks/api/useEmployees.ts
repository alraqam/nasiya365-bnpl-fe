/**
 * Employee-related hooks
 * Auto-generated from Nasiya BNPL API
 */

import { useState, useEffect, useCallback } from 'react'
import { employeeService } from 'src/services/employeeService'
import {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeQueryParams
} from 'src/@core/types/employee'
import { PaginationMeta } from 'src/@core/types/api'
import toast from 'react-hot-toast'

/**
 * Helper to normalize employee list response
 */
function normalizeEmployeeList(response: any): { employees: Employee[]; meta: PaginationMeta | null } {
  // Handle nested structure: { data: { data: [...], meta... } }
  if (response?.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
    const { data, ...paginationMeta } = response.data
    return { employees: data, meta: paginationMeta }
  }
  
  // Handle flat structure: { data: [...], meta... }
  if (Array.isArray(response?.data)) {
    return { employees: response.data, meta: response.meta || null }
  }
  
  return { employees: [], meta: null }
}

/**
 * Helper to normalize single employee response
 */
function normalizeEmployee(response: any): Employee | null {
  // Handle nested structure: { data: { data: {...} } }
  if (response?.data && typeof response.data === 'object' && 'data' in response.data) {
    const innerData = response.data.data
    if (innerData && typeof innerData === 'object' && !Array.isArray(innerData)) {
      return innerData as Employee
    }
  }
  
  // Handle flat structure: { data: {...} }
  if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
    return response.data as Employee
  }
  
  return null
}

/**
 * Hook to fetch all employees with pagination
 */
export function useEmployees(params?: EmployeeQueryParams) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [meta, setMeta] = useState<PaginationMeta | null>(null)

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await employeeService.getAll(params)
      const normalized = normalizeEmployeeList(response)
      setEmployees(normalized.employees)
      setMeta(normalized.meta)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.per_page, params?.search, params?.status, params?.branch_id, params?.role_id])

  useEffect(() => {
    fetchEmployees()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.page, params?.per_page, params?.search, params?.status, params?.branch_id, params?.role_id])

  return { employees, loading, error, meta, refetch: fetchEmployees }
}

/**
 * Hook to fetch a single employee
 */
export function useEmployee(id: number) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchEmployee = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await employeeService.getById(id)
      const normalized = normalizeEmployee(response)
      setEmployee(normalized)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load employee')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchEmployee()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return { employee, loading, error, refetch: fetchEmployee }
}

/**
 * Hook to create a new employee
 */
export function useCreateEmployee() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createEmployee = async (data: CreateEmployeeRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await employeeService.create(data)
      toast.success('Employee created successfully')
      return response.data
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to create employee')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createEmployee, loading, error }
}

/**
 * Hook to update an employee
 */
export function useUpdateEmployee() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateEmployee = async (id: number, data: UpdateEmployeeRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await employeeService.update(id, data)
      toast.success('Employee updated successfully')
      return response.data
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to update employee')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateEmployee, loading, error }
}

/**
 * Hook to delete an employee
 */
export function useDeleteEmployee() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const deleteEmployee = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await employeeService.delete(id)
      // Toast is handled by global API interceptor
    } catch (err) {
      setError(err as Error)
      // Toast is handled by global API interceptor
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteEmployee, loading, error }
}


