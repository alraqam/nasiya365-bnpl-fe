/**
 * BNPL Plan Service
 * Handles all BNPL plan operations
 * Generated from Nasiya BNPL API - BNPL Plans module
 */

import { api, apiClient } from 'src/configs/api'
import {
  BnplPlan,
  CreateBnplPlanRequest,
  UpdateBnplPlanRequest,
  AssignPlanToClientRequest,
  CalculatePlanPreviewRequest,
  PlanPreviewResponse,
  PlanStatistics,
  BnplPlanQueryParams
} from 'src/@core/types/bnpl-plan'
import { PaginatedResponse } from 'src/@core/types/api'

export const bnplPlanService = {
  /**
   * Get all BNPL plans with pagination
   */
  getAll: (params?: BnplPlanQueryParams) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.per_page) query.append('per_page', params.per_page.toString())
    if (params?.is_active !== undefined) query.append('is_active', params.is_active.toString())
    if (params?.is_default !== undefined) query.append('is_default', params.is_default.toString())

    const queryString = query.toString()
    return api<PaginatedResponse<BnplPlan>>(
      `/api/bnpl-plans${queryString ? '?' + queryString : ''}`
    )
  },

  /**
   * Get a single BNPL plan by ID
   */
  getById: (id: number) =>
    api<{ data: BnplPlan }>(`/api/bnpl-plans/${id}`),

  /**
   * Create a new BNPL plan
   */
  create: (data: CreateBnplPlanRequest) =>
    apiClient.post<{ data: BnplPlan }>('/api/bnpl-plans', data),

  /**
   * Update an existing BNPL plan
   */
  update: (id: number, data: UpdateBnplPlanRequest) =>
    apiClient.put<{ data: BnplPlan }>(`/api/bnpl-plans/${id}`, data),

  /**
   * Delete a BNPL plan
   */
  delete: (id: number) =>
    apiClient.delete(`/api/bnpl-plans/${id}`),

  /**
   * Activate a BNPL plan
   */
  activate: (id: number) =>
    apiClient.post(`/api/bnpl-plans/${id}/activate`),

  /**
   * Deactivate a BNPL plan
   */
  deactivate: (id: number) =>
    apiClient.post(`/api/bnpl-plans/${id}/deactivate`),

  /**
   * Assign a plan to a specific client
   */
  assignToClient: (planId: number, data: AssignPlanToClientRequest) =>
    apiClient.post(`/api/bnpl-plans/${planId}/assign-client`, data),

  /**
   * Get plans assigned to a client
   */
  getClientPlans: (clientId: number) =>
    api<{ data: BnplPlan[] }>(`/api/bnpl-plans/client/${clientId}`),

  /**
   * Get available plans for a client
   */
  getAvailableForClient: (clientId: number) =>
    api<{ data: BnplPlan[] }>(`/api/bnpl-plans/available-for-client/${clientId}`),

  /**
   * Calculate payment preview for a plan
   */
  calculatePreview: (data: CalculatePlanPreviewRequest) =>
    apiClient.post<{ data: PlanPreviewResponse }>(
      '/api/bnpl-plans/calculate-preview',
      data
    ),

  /**
   * Get statistics for a plan
   */
  getStatistics: (planId: number) =>
    api<{ data: PlanStatistics }>(`/api/bnpl-plans/${planId}/statistics`),

  /**
   * Get plans expiring soon
   */
  getExpiring: (days = 30) =>
    api<{ data: BnplPlan[] }>(`/api/bnpl-plans/expiring?days=${days}`)
}

