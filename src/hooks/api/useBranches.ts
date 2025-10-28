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
import { PaginatedResponse, PaginationMeta } from 'src/@core/types/api'
import toast from 'react-hot-toast'

type BranchListApiResponse =
  | PaginatedResponse<Branch>
  | { data: { data: Branch[]; meta?: unknown }; meta?: unknown }
  | { data: Branch[]; meta?: unknown }
  | Branch[]

type BranchSingleApiResponse =
  | { data: { data: Branch } }
  | { data: Branch }
  | null
  | undefined

type BranchStatsApiResponse = { data?: BranchStats | null }

const extractBranchList = (response: BranchListApiResponse): { items: Branch[]; meta: PaginationMeta | null } => {
  if (Array.isArray(response)) {
    return { items: response, meta: null }
  }

  if (response && typeof response === 'object') {
    const topLevel = response as { data?: unknown; meta?: unknown }
    const topMeta = ('meta' in topLevel && topLevel.meta) ? topLevel.meta as PaginationMeta : null
    const rawData = topLevel.data

    if (Array.isArray(rawData)) {
      return { items: rawData, meta: topMeta }
    }

    if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
      const nested = rawData as { data?: unknown; meta?: unknown }
      if (Array.isArray(nested.data)) {
        const nestedMeta = ('meta' in nested && nested.meta) ? nested.meta as PaginationMeta : null
        return { items: nested.data, meta: nestedMeta ?? topMeta }
      }
    }
  }

  return { items: [], meta: null }
}

const extractBranchSingle = (response: BranchSingleApiResponse): Branch | null => {
  if (!response || typeof response !== 'object') {
    return null
  }

  const topLevel = response as { data?: unknown }
  if (!('data' in topLevel)) {
    return null
  }

  const raw = topLevel.data

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const maybeNested = raw as { data?: unknown }

    if ('data' in maybeNested && maybeNested.data && typeof maybeNested.data === 'object' && !Array.isArray(maybeNested.data)) {
      return maybeNested.data as Branch
    }

    return raw as Branch
  }

  return null
}

/**
 * Hook to fetch all branches with pagination
 */
export function useBranches(params?: BranchQueryParams) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [meta, setMeta] = useState<PaginationMeta | null>(null)

  const fetchBranches = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = (await branchService.getAll(params)) as BranchListApiResponse
      const { items, meta } = extractBranchList(response)
      setBranches(items)
      setMeta(meta)
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
      const response = (await branchService.getById(id)) as BranchSingleApiResponse
      setBranch(extractBranchSingle(response))
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
      const response = (await branchService.getStats(id)) as BranchStatsApiResponse
      setStats(response?.data ?? null)
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

