import { STORAGE_KEYS } from 'src/@core/utils/constants'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://nasiya365.al-raqam.com"

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

export async function api<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const token = localStorage.getItem(STORAGE_KEYS.token)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
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
