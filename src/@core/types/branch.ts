/**
 * Branch types
 * Generated from Nasiya BNPL API - Branches module
 */

export interface Branch {
  id: number
  name: string
  address: string
  phone?: string
  email?: string
  manager_id?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateBranchRequest {
  name: string
  address: string
  phone?: string
  email?: string
  manager_id?: number
}

export type UpdateBranchRequest = Partial<CreateBranchRequest>

export interface BranchStats {
  total_orders: number
  total_revenue: number
  active_employees: number
  pending_orders: number
}

export interface BranchQueryParams {
  page?: number
  per_page?: number
  search?: string
  is_active?: boolean
}

