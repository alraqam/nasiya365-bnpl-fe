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
import toast from 'react-hot-toast'

/**
 * Hook to fetch all BNPL plans with pagination
 */
export function useBnplPlans(params?: BnplPlanQueryParams) {
  const [plans, setPlans] = useState<BnplPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [meta, setMeta] = useState<any>(null)

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await bnplPlanService.getAll(params)
      setPlans(response.data)
      setMeta(response.meta)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load BNPL plans')
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.per_page, params?.is_active, params?.is_default])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

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

