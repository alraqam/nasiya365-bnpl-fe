import { STORAGE_KEYS } from 'src/@core/utils/constants'
import env from './env'

const BASE_URL = env.baseUrl

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

export async function api<T = any>(endpoint: string, options: FetchOptions = {}, withBaseURL = true): Promise<T> {
  const token = localStorage.getItem(STORAGE_KEYS.token)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  }

  const response = await fetch(`${withBaseURL ? BASE_URL : ''}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null) // in case body is not JSON
    throw {
      status: response.status,
      ...errorBody
    }
  }

  return response.json() as Promise<T>
}
