import { STORAGE_KEYS } from 'src/@core/utils/constants'
import { parseApiError, NetworkError } from 'src/@core/utils/errors'
import { storage } from 'src/@core/utils/storage'
import { logger } from 'src/@core/utils/logger'
import env from './env'
import toast from 'react-hot-toast'

const BASE_URL = env.baseUrl

interface FetchOptions extends RequestInit {
  headers?: Record<string, string> | HeadersInit
  retry?: number
  retryDelay?: number
}

interface RequestInterceptor {
  onRequest?: (
    url: string,
    options: FetchOptions
  ) => Promise<{ url: string; options: FetchOptions }> | { url: string; options: FetchOptions }
  onError?: (error: Error) => void
}

interface ResponseInterceptor {
  onResponse?: (response: Response) => Promise<Response> | Response
  onError?: (error: Error) => void
}

class ApiClient {
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor)
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor)
  }

  /**
   * Make an API request with retry logic
   */
  async request<T = any>(endpoint: string, options: FetchOptions = {}, withBaseURL = true): Promise<T> {
    const { retry = 0, retryDelay = 1000, ...fetchOptions } = options

    let lastError: Error | null = null
    let attempts = 0

    while (attempts <= retry) {
      try {
        return await this.executeRequest<T>(endpoint, fetchOptions, withBaseURL)
      } catch (error) {
        lastError = error as Error
        attempts++

        if (attempts <= retry) {
          logger.warn(`Request failed, retrying (${attempts}/${retry})...`)
          await this.delay(retryDelay * attempts)
        }
      }
    }

    throw lastError || new NetworkError('Request failed after retries')
  }

  /**
   * Execute a single request
   */
  private async executeRequest<T>(endpoint: string, options: RequestInit, withBaseURL: boolean): Promise<T> {
    let url = `${withBaseURL ? BASE_URL : ''}${endpoint}`
    let requestOptions: FetchOptions = { ...options }

    // Get token and tenant ID from storage
    const token = storage.getItem(STORAGE_KEYS.token)
    const tenantId = storage.getItem(STORAGE_KEYS.tenant_id)
    
    // Set default headers
    requestOptions.headers = {
      'Content-Type': 'application/json',
      'Accept-Language': (storage.getItem(STORAGE_KEYS.lang) as string) || 'uz',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(tenantId ? { 'X-Tenant-ID': tenantId } : {}),
      ...(requestOptions.headers || {})
    }
    
    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      if (interceptor.onRequest) {
        try {
          const result = await interceptor.onRequest(url, requestOptions)
          url = result.url
          requestOptions = result.options
        } catch (error) {
          if (interceptor.onError) {
            interceptor.onError(error as Error)
          }
          throw error
        }
      }
    }

    let response: Response

    try {
      response = await fetch(url, requestOptions)
    } catch (error) {
      logger.error('Network error:', error)
      throw new NetworkError('Failed to connect to the server')
    }

    // Apply response interceptors
    for (const interceptor of this.responseInterceptors) {
      if (interceptor.onResponse) {
        try {
          response = await interceptor.onResponse(response)
        } catch (error) {
          if (interceptor.onError) {
            interceptor.onError(error as Error)
          }
          throw error
        }
      }
    }

    // Handle response
    const method = (requestOptions.method || 'GET').toString().toUpperCase()

    // Header helpers (case-insensitive access for Fetch headers init)
    const getHeader = (key: string): string | undefined => {
      const headers = requestOptions.headers as Record<string, string> | Headers | undefined
      if (!headers) return undefined
      if (headers instanceof Headers) {
        return headers.get(key) ?? undefined
      }
      const found = Object.keys(headers).find(k => k.toLowerCase() === key.toLowerCase())
      return found ? (headers as Record<string, string>)[found] : undefined
    }

    const toastDisabled = (getHeader('x-toast-disable') || '').toLowerCase() === 'true'
    const toastSuccessEnable = (getHeader('x-toast-success-enable') || '').toLowerCase() === 'true'
    const toastSuccessMessage = getHeader('x-toast-success')
    const toastErrorMessageOverride = getHeader('x-toast-error')

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`
      }))

      const error = parseApiError({
        status: response.status,
        ...errorBody
      })

      logger.error('API Error:', error)

      // Global error toast (unless disabled)
      if (!toastDisabled) {
        const messageFromApi = (error as any)?.message || (errorBody as any)?.message || `HTTP ${response.status}`
        // If validation errors exist, append field messages
        const validation = (error as any)?.errors
        let composed = toastErrorMessageOverride || messageFromApi
        if (validation && typeof validation === 'object') {
          const lines: string[] = []
          for (const [field, messages] of Object.entries(validation as Record<string, any>)) {
            if (Array.isArray(messages) && messages.length > 0) {
              lines.push(`${field}: ${messages[0]}`)
            }
          }
          if (lines.length > 0) {
            composed = `${messageFromApi}\n${lines.join('\n')}`
          }
        }
        toast.error(composed)
      }

      throw error
    }

    // Success handling
    const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)

    if (isMutating && !toastDisabled) {
      // Attempt to parse response to get message for toast, but do not consume the stream twice
      // We will clone and read once for message, then return the parsed JSON below
      const cloned = response.clone()
      let successPayload: any = null
      try {
        successPayload = await cloned.json()
      } catch (e) {
        // ignore parse error for toast purposes
      }

      const defaultMessage = 'Operation successful'
      const messageFromApi =
        (successPayload && (successPayload.message || successPayload?.data?.message)) || undefined

      const messageToShow = toastSuccessMessage || messageFromApi || defaultMessage

      // Show success toast by default for mutating methods, or when explicitly enabled
      if (toastSuccessEnable || !toastSuccessMessage || messageToShow) {
        toast.success(messageToShow)
      }
    }

    return response.json() as Promise<T>
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Convenience methods
   */
  get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, body?: any, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    })
  }

  put<T>(endpoint: string, body?: any, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    })
  }

  patch<T>(endpoint: string, body?: any, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined
    })
  }

  delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// Create singleton instance
const apiClient = new ApiClient()

// Export the main API function for backward compatibility
export async function api<T = any>(endpoint: string, options: FetchOptions = {}, withBaseURL = true): Promise<T> {
  return apiClient.request<T>(endpoint, options, withBaseURL)
}

// Export the client for advanced usage
export { apiClient }
