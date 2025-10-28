/**
 * Currency-related hooks
 * Auto-generated from Nasiya BNPL API
 */

import { useState, useEffect, useCallback } from 'react'
import { currencyService } from 'src/services/currencyService'
import {
  Currency,
  CreateCurrencyRequest,
  UpdateCurrencyRateRequest,
  ConvertCurrencyRequest
} from 'src/@core/types/currency'
import toast from 'react-hot-toast'

/**
 * Hook to fetch all currencies
 */
export function useCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCurrencies = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await currencyService.getAll()
      // Handle nested response structure: { status, data: [...] } or { data: [...] }
      if (response.data && Array.isArray(response.data)) {
        setCurrencies(response.data)
      } else if (Array.isArray(response)) {
        setCurrencies(response)
      } else {
        setCurrencies([])
      }
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load currencies')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCurrencies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { currencies, loading, error, refetch: fetchCurrencies }
}

/**
 * Hook to fetch a single currency
 */
export function useCurrency(id: number) {
  const [currency, setCurrency] = useState<Currency | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchCurrency = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = (await currencyService.getByCode(String(id))) as any
      // Handle nested response structure: { status, data: { data: {...} } } or { data: {...} }
      if (response?.data) {
        if (response.data?.data && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
          setCurrency(response.data.data)
        } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
          setCurrency(response.data)
        } else {
          setCurrency(null)
        }
      } else {
        setCurrency(null)
      }
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load currency')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchCurrency()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return { currency, loading, error, refetch: fetchCurrency }
}

/**
 * Hook to create a new currency
 */
export function useCreateCurrency() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createCurrency = async (data: CreateCurrencyRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = (await currencyService.create(data)) as any
      toast.success('Currency created successfully')
      return response.data
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to create currency')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createCurrency, loading, error }
}

/**
 * Hook to update currency rate
 */
export function useUpdateCurrencyRate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateRate = async (id: number, data: UpdateCurrencyRateRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = (await currencyService.updateRate(id, data)) as any
      toast.success('Currency rate updated successfully')
      return response.data
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to update currency rate')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateRate, loading, error }
}

/**
 * Hook to convert currency
 */
export function useConvertCurrency() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const convert = async (data: ConvertCurrencyRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = (await currencyService.convert(data)) as any
      return response.data
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to convert currency')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { convert, loading, error }
}

/**
 * Hook to fetch base currency
 */
export function useBaseCurrency() {
  const [baseCurrency, setBaseCurrency] = useState<Currency | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBaseCurrency = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = (await currencyService.getBaseCurrency()) as any
      // Handle nested response structure: { status, data: { data: {...} } } or { data: {...} }
      if (response.data) {
        // Check if it's double nested
        if (response.data.data && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
          setBaseCurrency(response.data.data)
        } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
          setBaseCurrency(response.data)
        } else {
          setBaseCurrency(null)
        }
      } else {
        setBaseCurrency(null)
      }
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load base currency')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBaseCurrency()
  }, [fetchBaseCurrency])

  return { baseCurrency, loading, error, refetch: fetchBaseCurrency }
}

