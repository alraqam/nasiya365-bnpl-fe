/**
 * Order-related hooks
 * Auto-generated from Nasiya BNPL API
 */

import { useState, useEffect, useCallback } from 'react'
import { orderService } from 'src/services/orderService'
import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderQueryParams,
  CalculateOrderPreview,
  PaymentRequest
} from 'src/@core/types/order'
import toast from 'react-hot-toast'

/**
 * Hook to fetch all orders with pagination
 */
export function useOrders(params?: OrderQueryParams) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [meta, setMeta] = useState<any>(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await orderService.getAll(params)
      // Handle nested response structure: { status, data: { data: [...], meta... } }
      if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data)
        const { data: _data, ...paginationMeta } = response.data
        setMeta(paginationMeta)
      } else if (Array.isArray(response.data)) {
        setOrders(response.data)
        setMeta(response.meta)
      } else {
        setOrders([])
        setMeta(null)
      }
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.per_page, params?.search, params?.status, params?.client_id, params?.date_from, params?.date_to])

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.page, params?.per_page, params?.search, params?.status, params?.client_id, params?.date_from, params?.date_to])

  return { orders, loading, error, meta, refetch: fetchOrders }
}

/**
 * Hook to fetch a single order
 */
export function useOrder(id: number) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await orderService.getById(id)
      // Handle nested response structure
      if (response.data) {
        if (response.data.data && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
          setOrder(response.data.data)
        } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
          setOrder(response.data)
        } else {
          setOrder(null)
        }
      } else {
        setOrder(null)
      }
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load order')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchOrder()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return { order, loading, error, refetch: fetchOrder }
}

/**
 * Hook to create a BNPL order
 */
export function useCreateBnplOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createOrder = async (data: CreateOrderRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await orderService.createBnpl(data)
      toast.success('BNPL order created successfully')
      return response.data
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to create order')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createOrder, loading, error }
}

/**
 * Hook to create a cash order
 */
export function useCreateCashOrder() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createOrder = async (data: Omit<CreateOrderRequest, 'bnpl_plan_id' | 'initial_payment'>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await orderService.createCash(data)
      toast.success('Cash order created successfully')
      return response.data
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to create order')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createOrder, loading, error }
}

/**
 * Hook to calculate order preview
 */
export function useCalculateOrderPreview() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const calculatePreview = async (data: CalculateOrderPreview) => {
    try {
      setLoading(true)
      setError(null)
      const response = await orderService.calculatePreview(data)
      return response.data
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to calculate preview')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { calculatePreview, loading, error }
}

/**
 * Hook to pay initial payment
 */
export function usePayInitialPayment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const payInitial = async (orderId: number, payment: PaymentRequest) => {
    try {
      setLoading(true)
      setError(null)
      await orderService.payInitial(orderId, payment)
      toast.success('Payment processed successfully')
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to process payment')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { payInitial, loading, error }
}


