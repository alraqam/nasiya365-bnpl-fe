/**
 * Client-related hooks
 * Auto-generated from Nasiya BNPL API
 */

import { useState, useEffect, useCallback } from 'react'
import { clientService } from 'src/services/clientService'
import { Client, CreateClientRequest, UpdateClientRequest, ClientQueryParams } from 'src/@core/types/client'
import { PaginationMeta } from 'src/@core/types/api'
import toast from 'react-hot-toast'

/**
 * Hook to fetch all clients with pagination
 */
export function useClients(params?: ClientQueryParams) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [meta, setMeta] = useState<PaginationMeta | null>(null)

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // The API may respond with different shapes (paginated / flat array)
      const response = (await clientService.getAll(params)) as any
      // Handle nested response structure: { status, data: { data: [...], meta... } }
      if (response.data && Array.isArray(response.data.data)) {
        setClients(response.data.data)
        // Extract pagination meta from the response
        const { data: _data, ...paginationMeta } = response.data
        setMeta(paginationMeta)
      } else if (Array.isArray(response.data)) {
        // Fallback for old response structure
        setClients(response.data)
        setMeta(response.meta)
      } else {
        setClients([])
        setMeta(null)
      }
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.per_page, params?.search, params?.status, params?.passport, params?.phone])

  useEffect(() => {
    let cancelled = false
    
    const loadClients = async () => {
      if (cancelled) return
      await fetchClients()
    }
    
    loadClients()
    
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.page, params?.per_page, params?.search, params?.status, params?.passport, params?.phone])

  return { clients, loading, error, meta, refetch: fetchClients }
}

/**
 * Hook to fetch a single client
 */
export function useClient(id: number) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchClient = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = (await clientService.getById(id)) as any
      // Support both nested { data: { data: client } } and flat { data: client } shapes
      if (response.data) {
        if (response.data.data && typeof response.data.data === 'object' && !Array.isArray(response.data.data)) {
          setClient(response.data.data)
        } else if (typeof response.data === 'object' && !Array.isArray(response.data)) {
          setClient(response.data)
        } else {
          setClient(null)
        }
      } else {
        setClient(null)
      }
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load client')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    let cancelled = false
    
    const loadClient = async () => {
      if (cancelled || !id) return
      await fetchClient()
    }
    
    if (id) {
      loadClient()
    }
    
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return { client, loading, error, refetch: fetchClient }
}

/**
 * Hook to create a new client
 */
export function useCreateClient() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createClient = async (data: CreateClientRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await clientService.create(data)
      toast.success('Client created successfully')
      return response.data
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to create client')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createClient, loading, error }
}

/**
 * Hook to update a client
 */
export function useUpdateClient() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateClient = async (id: number, data: UpdateClientRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await clientService.update(id, data)
      toast.success('Client updated successfully')
      return response.data
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to update client')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateClient, loading, error }
}

/**
 * Hook to delete a client
 */
export function useDeleteClient() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const deleteClient = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await clientService.delete(id)
      // Toast is handled by global API interceptor
    } catch (err) {
      setError(err as Error)
      // Toast is handled by global API interceptor
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteClient, loading, error }
}


