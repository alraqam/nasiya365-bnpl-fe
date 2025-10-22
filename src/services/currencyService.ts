/**
 * Currency Service
 * Handles all currency operations
 * Generated from Nasiya BNPL API - Currencies module
 */

import { api, apiClient } from 'src/configs/api'
import {
  Currency,
  CreateCurrencyRequest,
  UpdateCurrencyRateRequest,
  ConvertCurrencyRequest,
  ConvertCurrencyResponse,
  CurrencyRates,
  CurrencyStats
} from 'src/@core/types/currency'

export const currencyService = {
  /**
   * Get all currencies
   */
  getAll: () =>
    api<{ data: Currency[] }>('/api/currencies'),

  /**
   * Get a single currency by ID
   */
  getById: (id: number) =>
    api<{ data: Currency }>(`/api/currencies/${id}`),

  /**
   * Create a new currency
   */
  create: (data: CreateCurrencyRequest) =>
    apiClient.post<{ data: Currency }>('/api/currencies', data),

  /**
   * Update currency exchange rate
   */
  updateRate: (id: number, data: UpdateCurrencyRateRequest) =>
    apiClient.put<{ data: Currency }>(`/api/currencies/${id}/rate`, data),

  /**
   * Set a currency as base currency
   */
  setBase: (id: number) =>
    apiClient.post(`/api/currencies/${id}/set-base`),

  /**
   * Convert amount between currencies
   */
  convert: (data: ConvertCurrencyRequest) =>
    apiClient.post<{ data: ConvertCurrencyResponse }>('/api/currencies/convert', data),

  /**
   * Get all exchange rates
   */
  getAllRates: () =>
    api<{ data: CurrencyRates }>('/api/currencies/rates'),

  /**
   * Fetch latest rates from external source
   */
  fetchRates: () =>
    apiClient.post('/api/currencies/fetch-rates'),

  /**
   * Get current base currency
   */
  getBaseCurrency: () =>
    api<{ data: Currency }>('/api/currencies/base'),

  /**
   * Get currency statistics
   */
  getStats: () =>
    api<{ data: CurrencyStats }>('/api/currencies/stats')
}

