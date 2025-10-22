/**
 * Client-related hooks
 * Auto-generated from Nasiya BNPL API
 */

import { useState, useEffect, useCallback } from 'react'
import { clientService } from 'src/services/clientService'
import { Client, CreateClientRequest, UpdateClientRequest, ClientQueryParams } from 'src/@core/types/client'
import toast from 'react-hot-toast'

/**
 * Hook to fetch all clients with pagination
 */
export function useClients(params?: ClientQueryParams) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [meta, setMeta] = useState<any>(null)

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await clientService.getAll(params)
      setClients(response.data)
      setMeta(response.meta)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }, [params?.page, params?.per_page, params?.search, params?.status, params?.passport, params?.phone])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

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
      const response = await clientService.getById(id)
      setClient(response.data)
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to load client')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchClient()
    }
  }, [id, fetchClient])

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
      toast.success('Client deleted successfully')
    } catch (err) {
      setError(err as Error)
      toast.error('Failed to delete client')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteClient, loading, error }
}

