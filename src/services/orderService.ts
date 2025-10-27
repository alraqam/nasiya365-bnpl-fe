/**
 * Order Service
 * Handles all order-related API operations including BNPL and cash payments
 * Generated from Nasiya BNPL API - Orders module
 */

import { api, apiClient } from 'src/configs/api'
import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderQueryParams,
  CalculateOrderPreview,
  OrderPreviewResponse,
  PaymentRequest,
  PaymentSummary
} from 'src/@core/types/order'
import { PaginatedResponse } from 'src/@core/types/api'
import { BnplPlan } from 'src/@core/types/bnpl-plan'

export const orderService = {
  /**
   * Get all orders with pagination
   */
  getAll: (params?: OrderQueryParams) => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.per_page) query.append('per_page', params.per_page.toString())
    if (params?.search) query.append('search', params.search)
    if (params?.status) query.append('status', params.status)
    if (params?.client_id) query.append('client_id', params.client_id.toString())
    if (params?.date_from) query.append('date_from', params.date_from)
    if (params?.date_to) query.append('date_to', params.date_to)

    const queryString = query.toString()
    return api<PaginatedResponse<Order>>(
      `/api/orders${queryString ? '?' + queryString : ''}`
    )
  },

  /**
   * Get a single order by ID
   */
  getById: (id: number) =>
    api<{ data: Order }>(`/api/orders/${id}`),

  /**
   * Create a new BNPL order
   */
  createBnpl: (data: CreateOrderRequest) =>
    apiClient.post<{ data: Order }>('/api/orders', { ...data, is_cash: false }),

  /**
   * Create a new cash order
   */
  createCash: (data: Omit<CreateOrderRequest, 'bnpl_plan_id' | 'initial_payment'>) =>
    apiClient.post<{ data: Order }>('/api/orders', { ...data, is_cash: true }),

  /**
   * Update an existing order
   */
  update: (id: number, data: UpdateOrderRequest) =>
    apiClient.put<{ data: Order }>(`/api/orders/${id}`, data),

  /**
   * Delete an order
   */
  delete: (id: number) =>
    apiClient.delete(`/api/orders/${id}`),

  /**
   * Get available BNPL plans for an order
   */
  getAvailablePlans: (clientId: number, amount: number) =>
    api<{ data: BnplPlan[] }>(
      `/api/orders/available-plans?client_id=${clientId}&amount=${amount}`
    ),

  /**
   * Calculate order preview (monthly payments, total, etc.)
   */
  calculatePreview: (data: CalculateOrderPreview) =>
    apiClient.post<{ data: OrderPreviewResponse }>(
      '/api/orders/calculate-preview',
      data
    ),

  /**
   * Pay initial payment for an order
   */
  payInitial: (orderId: number, payment: PaymentRequest) =>
    apiClient.post<{ data: { message: string } }>(
      `/api/orders/${orderId}/pay-initial`,
      payment
    ),

  /**
   * Make direct cash purchase (full payment)
   */
  directCash: (orderId: number, amount: number, notes?: string) =>
    apiClient.post<{ data: { message: string } }>(
      `/api/orders/${orderId}/direct-cash`,
      { amount, notes }
    ),

  /**
   * Get payment summary for an order
   */
  getPaymentSummary: (orderId: number) =>
    api<{ data: PaymentSummary }>(`/api/orders/${orderId}/payment-summary`)
}


