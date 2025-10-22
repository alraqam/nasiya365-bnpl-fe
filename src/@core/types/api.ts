/**
 * Common API response types
 * Generated from Nasiya BNPL API Collection
 */

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from?: number
  to?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
  status?: number
}

export interface QueryParams {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

