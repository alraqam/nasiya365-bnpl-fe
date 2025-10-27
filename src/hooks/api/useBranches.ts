/**
 * Branch-related hooks
 * Auto-generated from Nasiya BNPL API
 */

import { useState, useEffect, useCallback } from 'react'
import { branchService } from 'src/services/branchService'
import {
  Branch,
  CreateBranchRequest,
  UpdateBranchRequest,
  BranchQueryParams,
  BranchStats
} from 'src/@core/types/branch'
import toast from 'react-hot-toast'

/**
 * Hook to fetch all branches with pagination
 */
export function useBranches(params?: BranchQueryParams) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [meta, setMeta] = useState<any>(null)

  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await branchService.getAll(params)
      // Handle nested response structure: { status, data: { data: [...], meta... } }
      if (response.data && Array.isArray(response.data.data)) {
        setBranches(response.data.data)
        const { data: _data, ...paginationMeta } = response.data
        setMeta(paginationMeta)
      } else if (Array.isArray(response.data)) {
        setBranches(response.data)
        setMeta(response.meta)
      } else {
        setBranches([])
        setMeta(null)
      }
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load branches')
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.per_page, params?.search, params?.is_active])

  useEffect(() => {
    let cancelled = false
    
    const loadBranches = async () => {
      if (cancelled) return
      await fetchBranches()
    }
    
    loadBranches()
    
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.page, params?.per_page, params?.search, params?.is_active])

  return { branches, loading, error, meta, refetch: fetchBranches }
}

/**
 * Hook to fetch a single branch
 */
export function useBranch(id: number) {
  const [branch, setBranch] = useState<Branch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBranch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await branchService.getById(id)
      // Handle nested response structure
      if (response.data) {
        if (response.data.data && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
          setBranch(response.data.data)
        } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
          setBranch(response.data)
        } else {
          setBranch(null)
        }
      } else {
        setBranch(null)
      }
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load branch')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    let cancelled = false
    
    const loadBranch = async () => {
      if (cancelled || !id) return
      await fetchBranch()
    }
    
    if (id) {
      loadBranch()
    }
    
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return { branch, loading, error, refetch: fetchBranch }
}

/**
 * Hook to fetch branch statistics
 */
export function useBranchStats(id: number) {
  const [stats, setStats] = useState<BranchStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await branchService.getStats(id)
      if (response.data) {
        setStats(response.data)
      } else {
        setStats(null)
      }
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load branch statistics')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    let cancelled = false
    
    const loadStats = async () => {
      if (cancelled || !id) return
      await fetchStats()
    }
    
    if (id) {
      loadStats()
    }
    
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return { stats, loading, error, refetch: fetchStats }
}

/**
 * Hook to create a new branch
 */
export function useCreateBranch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createBranch = async (data: CreateBranchRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await branchService.create(data)
      toast.success('Branch created successfully')
      return response.data
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to create branch')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createBranch, loading, error }
}

/**
 * Hook to update a branch
 */
export function useUpdateBranch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateBranch = async (id: number, data: UpdateBranchRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await branchService.update(id, data)
      toast.success('Branch updated successfully')
      return response.data
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to update branch')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateBranch, loading, error }
}

/**
 * Hook to delete a branch
 */
export function useDeleteBranch() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const deleteBranch = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await branchService.delete(id)
      toast.success('Branch deleted successfully')
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to delete branch')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteBranch, loading, error }
}

