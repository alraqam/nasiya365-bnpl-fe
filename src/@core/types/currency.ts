/**
 * Currency types
 * Generated from Nasiya BNPL API - Currencies module
 */

export interface Currency {
  id: number
  code: string
  name: string
  symbol: string
  rate: number
  is_base: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateCurrencyRequest {
  code: string
  name: string
  symbol: string
  rate: number
  is_active?: boolean
}

export interface UpdateCurrencyRateRequest {
  rate: number
}

export interface ConvertCurrencyRequest {
  amount: number
  from_currency: string
  to_currency: string
}

export interface ConvertCurrencyResponse {
  amount: number
  from_currency: string
  to_currency: string
  converted_amount: number
  rate: number
}

export interface CurrencyRates {
  [code: string]: number
}

export interface CurrencyStats {
  total_currencies: number
  base_currency: string
  last_update: string
}

