/**
 * Client Service
 * Handles all client-related API operations
 * Generated from Nasiya BNPL API - Clients module
 */

import { api, apiClient } from 'src/configs/api'
import { Client, CreateClientRequest, UpdateClientRequest, ClientQueryParams } from 'src/@core/types/client'
import { PaginatedResponse } from 'src/@core/types/api'

export const clientService = {
  /**
   * Get all clients with pagination
   */
  getAll: (params?: ClientQueryParams) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.per_page) query.append('per_page', params.per_page.toString())
    if (params?.search) query.append('search', params.search)
    if (params?.status) query.append('status', params.status)
    if (params?.passport) query.append('passport', params.passport)
    if (params?.phone) query.append('phone', params.phone)

    const queryString = query.toString()
    return api<PaginatedResponse<Client>>(`/api/clients${queryString ? '?' + queryString : ''}`)
  },

  /**
   * Get a single client by ID
   */
  getById: (id: number) => api<{ data: Client }>(`/api/clients/${id}`),

  /**
   * Create a new client
   */
  create: (data: CreateClientRequest) => apiClient.post<{ data: Client }>('/api/clients', data),

  /**
   * Update an existing client
   */
  update: (id: number, data: UpdateClientRequest) => apiClient.put<{ data: Client }>(`/api/clients/${id}`, data),

  /**
   * Delete a client
   */
  delete: (id: number) => apiClient.delete(`/api/clients/${id}`),

  /**
   * Search clients
   */
  search: (searchTerm: string, params?: Omit<ClientQueryParams, 'search'>) =>
    clientService.getAll({ ...params, search: searchTerm })
}
