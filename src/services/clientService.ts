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
<<<<<<< HEAD
    return api<PaginatedResponse<Client>>(`/api/clients${queryString ? '?' + queryString : ''}`)
=======
    return api<PaginatedResponse<Client>>(
      `/api/clients${queryString ? '?' + queryString : ''}`
    )
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)
  },

  /**
   * Get a single client by ID
   */
<<<<<<< HEAD
  getById: (id: number) => api<{ data: Client }>(`/api/clients/${id}`),
=======
  getById: (id: number) =>
    api<{ data: Client }>(`/api/clients/${id}`),
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)

  /**
   * Create a new client
   */
<<<<<<< HEAD
  create: (data: CreateClientRequest) => apiClient.post<{ data: Client }>('/api/clients', data),
=======
  create: (data: CreateClientRequest) =>
    apiClient.post<{ data: Client }>('/api/clients', data),
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)

  /**
   * Update an existing client
   */
<<<<<<< HEAD
  update: (id: number, data: UpdateClientRequest) => apiClient.put<{ data: Client }>(`/api/clients/${id}`, data),
=======
  update: (id: number, data: UpdateClientRequest) =>
    apiClient.put<{ data: Client }>(`/api/clients/${id}`, data),
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)

  /**
   * Delete a client
   */
<<<<<<< HEAD
  delete: (id: number) => apiClient.delete(`/api/clients/${id}`),
=======
  delete: (id: number) =>
    apiClient.delete(`/api/clients/${id}`),
>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)

  /**
   * Search clients
   */
  search: (searchTerm: string, params?: Omit<ClientQueryParams, 'search'>) =>
    clientService.getAll({ ...params, search: searchTerm })
}
<<<<<<< HEAD
=======


>>>>>>> 14108f2 (v2.1 fix all the api issues and change color scheme)
