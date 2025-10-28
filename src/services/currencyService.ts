/**
 * Currency Service
 * Handles all currency operations
 * Generated from Nasiya BNPL API - Currencies module
 */

import { api, apiClient } from 'src/configs/api'
import { Currency, CurrencyRates } from 'src/@core/types/currency'

export const currencyService = {
  /**
   * Get available currencies
   */
  getAll: () => api<{ data: Currency[] }>('/api/currencies'),

  /**
   * Get a single currency by code
   */
  getByCode: (code: string) => api<{ data: Currency }>(`/api/currencies/${code}`),

  /**
   * Create a new currency
   */
  create: (data: { code: string; name: string; symbol: string; rate: number; is_active?: boolean }) =>
    apiClient.post<{ data: Currency }>('/api/currencies', data),

  /**
   * Update currency rate
   */
  updateRate: (id: number, data: { rate: number }) =>
    apiClient.put<{ data: Currency }>(`/api/currencies/${id}/rate`, data),

  /**
   * Convert currency
   */
  convert: (data: { amount: number; from_currency: string; to_currency: string }) =>
    api<{ data: { converted_amount: number; rate: number } }>('/api/currencies/convert', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  /**
   * Get base currency
   */
  getBaseCurrency: () => api<{ data: Currency }>('/api/currencies/base'),

  /**
   * Get currency rates
   */
  getRates: () => api<{ data: CurrencyRates }>('/api/currencies/rates')
}


