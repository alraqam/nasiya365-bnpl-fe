/**
 * Investor and Investment Service
 * Handles all investor and investment operations
 * Generated from Nasiya BNPL API - Investors & Investments modules
 */

import { api, apiClient } from 'src/configs/api'
import {
  Investor,
  CreateInvestorRequest,
  UpdateInvestorRequest,
  Investment,
  CreateInvestmentRequest,
  UpdateInvestmentRequest,
  InvestorQueryParams,
  InvestmentQueryParams
} from 'src/@core/types/investor'
import { PaginatedResponse } from 'src/@core/types/api'

export const investorService = {
  /**
   * Get all investors with pagination
   */
  getAll: (params?: InvestorQueryParams) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.per_page) query.append('per_page', params.per_page.toString())
    if (params?.search) query.append('search', params.search)
    if (params?.is_active !== undefined) query.append('is_active', params.is_active.toString())

    const queryString = query.toString()
    return api<PaginatedResponse<Investor>>(
      `/api/investors${queryString ? '?' + queryString : ''}`
    )
  },

  /**
   * Get a single investor by ID
   */
  getById: (id: number) =>
    api<{ data: Investor }>(`/api/investors/${id}`),

  /**
   * Create a new investor
   */
  create: (data: CreateInvestorRequest) =>
    apiClient.post<{ data: Investor }>('/api/investors', data),

  /**
   * Update an existing investor
   */
  update: (id: number, data: UpdateInvestorRequest) =>
    apiClient.put<{ data: Investor }>(`/api/investors/${id}`, data),

  /**
   * Delete an investor
   */
  delete: (id: number) =>
    apiClient.delete(`/api/investors/${id}`)
}

export const investmentService = {
  /**
   * Get all investments with pagination
   */
  getAll: (params?: InvestmentQueryParams) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.per_page) query.append('per_page', params.per_page.toString())
    if (params?.investor_id) query.append('investor_id', params.investor_id.toString())
    if (params?.status) query.append('status', params.status)
    if (params?.date_from) query.append('date_from', params.date_from)
    if (params?.date_to) query.append('date_to', params.date_to)

    const queryString = query.toString()
    return api<PaginatedResponse<Investment>>(
      `/api/investments${queryString ? '?' + queryString : ''}`
    )
  },

  /**
   * Get a single investment by ID
   */
  getById: (id: number) =>
    api<{ data: Investment }>(`/api/investments/${id}`),

  /**
   * Create a new investment
   */
  create: (data: CreateInvestmentRequest) =>
    apiClient.post<{ data: Investment }>('/api/investments', data),

  /**
   * Update an existing investment
   */
  update: (id: number, data: UpdateInvestmentRequest) =>
    apiClient.put<{ data: Investment }>(`/api/investments/${id}`, data),

  /**
   * Delete an investment
   */
  delete: (id: number) =>
    apiClient.delete(`/api/investments/${id}`)
}

