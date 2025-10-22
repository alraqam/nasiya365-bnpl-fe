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
import toast from 'react-hot-toast'

/**
 * Hook to fetch all employees with pagination
 */
export function useEmployees(params?: EmployeeQueryParams) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [meta, setMeta] = useState<any>(null)

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await employeeService.getAll(params)
      setEmployees(response.data)
      setMeta(response.meta)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.per_page, params?.search, params?.status, params?.branch_id, params?.role_id])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

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
      setEmployee(response.data)
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
  }, [id, fetchEmployee])

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

