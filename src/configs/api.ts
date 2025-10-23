import { STORAGE_KEYS } from 'src/@core/utils/constants'
import { parseApiError, NetworkError } from 'src/@core/utils/errors'
import { storage } from 'src/@core/utils/storage'
import { logger } from 'src/@core/utils/logger'
import env from './env'

const BASE_URL = env.baseUrl

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
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

    // Get token from storage
    const token = storage.getItem(STORAGE_KEYS.token)

    // Set default headers
    requestOptions.headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(requestOptions.headers || {}),
      'X-Tenant-ID': 'demo'
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
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`
      }))

      const error = parseApiError({
        status: response.status,
        ...errorBody
      })

      logger.error('API Error:', error)
      throw error
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
