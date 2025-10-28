/**
 * BNPL Plan-related hooks
 * Auto-generated from Nasiya BNPL API
 */

import { useState, useEffect, useCallback } from 'react'
import { bnplPlanService } from 'src/services/bnplPlanService'
import {
  BnplPlan,
  CreateBnplPlanRequest,
  UpdateBnplPlanRequest,
  BnplPlanQueryParams,
  CalculatePlanPreviewRequest
} from 'src/@core/types/bnpl-plan'
import { PaginatedResponse, PaginationMeta } from 'src/@core/types/api'
import toast from 'react-hot-toast'

interface ApiResponse<T> {
  data: T
  meta?: Record<string, any>
}

function extractData<T>(response: PaginatedResponse<T> | ApiResponse<T[]> | T[]): { items: T[]; meta: PaginationMeta | null } {
  if (Array.isArray(response)) {
    return { items: response, meta: null }
  }

  if ('data' in response && Array.isArray(response.data)) {
    return { items: response.data, meta: ('meta' in response && response.meta) ? response.meta as PaginationMeta : null }
  }

  return { items: [], meta: null }
}

/**
 * Hook to fetch all BNPL plans with pagination
 */
export function useBnplPlans(params?: BnplPlanQueryParams) {
  const [plans, setPlans] = useState<BnplPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [meta, setMeta] = useState<PaginationMeta | null>(null)

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await bnplPlanService.getAll(params)
      const { items, meta } = extractData<BnplPlan>(response as any)
      setPlans(items)
      setMeta(meta)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load BNPL plans')
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.per_page, params?.is_active, params?.is_default])

  useEffect(() => {
    fetchPlans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.page, params?.per_page, params?.is_active, params?.is_default])

  return { plans, loading, error, meta, refetch: fetchPlans }
}

/**
 * Hook to fetch available plans for a client
 */
export function useAvailablePlansForClient(clientId: number) {
  const [plans, setPlans] = useState<BnplPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await bnplPlanService.getAvailableForClient(clientId)
        setPlans(response.data)
      } catch (err) {
        setError(err as Error)
        toast.error('Failed to load available plans')
      } finally {
        setLoading(false)
      }
    }

    if (clientId) {
      fetchPlans()
    }
  }, [clientId])

  return { plans, loading, error }
}

/**
 * Hook to calculate plan preview
 */
export function useCalculatePlanPreview() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const calculatePreview = async (data: CalculatePlanPreviewRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await bnplPlanService.calculatePreview(data)
      return response.data
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to calculate plan preview')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { calculatePreview, loading, error }
}


