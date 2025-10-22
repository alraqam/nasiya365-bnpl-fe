/**
 * Branch Service
 * Handles all branch operations
 * Generated from Nasiya BNPL API - Branches module
 */

import { api, apiClient } from 'src/configs/api'
import {
  Branch,
  CreateBranchRequest,
  UpdateBranchRequest,
  BranchStats,
  BranchQueryParams
} from 'src/@core/types/branch'
import { PaginatedResponse } from 'src/@core/types/api'

export const branchService = {
  /**
   * Get all branches with pagination
   */
  getAll: (params?: BranchQueryParams) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.per_page) query.append('per_page', params.per_page.toString())
    if (params?.search) query.append('search', params.search)
    if (params?.is_active !== undefined) query.append('is_active', params.is_active.toString())

    const queryString = query.toString()
    return api<PaginatedResponse<Branch>>(
      `/api/branches${queryString ? '?' + queryString : ''}`
    )
  },

  /**
   * Get a single branch by ID
   */
  getById: (id: number) =>
    api<{ data: Branch }>(`/api/branches/${id}`),

  /**
   * Create a new branch
   */
  create: (data: CreateBranchRequest) =>
    apiClient.post<{ data: Branch }>('/api/branches', data),

  /**
   * Update an existing branch
   */
  update: (id: number, data: UpdateBranchRequest) =>
    apiClient.put<{ data: Branch }>(`/api/branches/${id}`, data),

  /**
   * Delete a branch
   */
  delete: (id: number) =>
    apiClient.delete(`/api/branches/${id}`),

  /**
   * Get branch statistics
   */
  getStats: (id: number) =>
    api<{ data: BranchStats }>(`/api/branches/${id}/stats`)
}

