/**
 * BNPL Plan types
 * Generated from Nasiya BNPL API - BNPL Plans module
 */

export interface BnplPlan {
  id: number
  name: string
  description: string
  payment_periods: number[]
  min_amount: number
  max_amount: number
  min_period_months: number
  max_period_months: number
  interest_rate: number
  min_down_payment_percent: number
  is_active: boolean
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface CreateBnplPlanRequest {
  name: string
  description: string
  payment_periods: number[]
  min_amount: number
  max_amount: number
  min_period_months: number
  max_period_months: number
  interest_rate: number
  min_down_payment_percent: number
  is_active?: boolean
  is_default?: boolean
}

export type UpdateBnplPlanRequest = Partial<CreateBnplPlanRequest>

export interface AssignPlanToClientRequest {
  client_id: number
  expires_at: string
  notes?: string
}

export interface CalculatePlanPreviewRequest {
  plan_id: number
  amount: number
  period: number
  down_payment: number
}

export interface PlanPreviewResponse {
  monthly_payment: number
  total_amount: number
  interest_amount: number
  down_payment: number
  payment_schedule: {
    month: number
    amount: number
    due_date: string
  }[]
}

export interface PlanStatistics {
  total_clients: number
  active_orders: number
  total_revenue: number
  average_order_value: number
}

export interface BnplPlanQueryParams {
  page?: number
  per_page?: number
  is_active?: boolean
  is_default?: boolean
}

