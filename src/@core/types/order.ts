/**
 * Order types
 * Generated from Nasiya BNPL API - Orders module
 */

export interface Order {
  id: number
  client_id: number
  user_id: number
  product_id: number
  summa: number
  is_cash: boolean
  bnpl_plan_id?: number
  initial_payment?: number
  box: number
  pay_day: number
  branch_id: number
  currency_code: string
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  client?: {
    id: number
    first_name: string
    last_name: string
    phone: string
  }
  product?: {
    id: number
    name: string
    price: number
  }
  notes?: string
  NumberOrder?: string
  client_name?: string
  model?: string
  pay_type?: string
  rest_summa?: number
}

export interface CreateOrderRequest {
  client_id: number
  user_id: number
  product_id: number
  summa: number
  is_cash: boolean
  bnpl_plan_id?: number
  initial_payment?: number
  box: number
  pay_day: number
  branch_id: number
  currency_code: string
  notes?: string
}

export interface UpdateOrderRequest {
  summa?: number
  notes?: string
  status?: Order['status']
}

export interface OrderQueryParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  client_id?: number
  date_from?: string
  date_to?: string
}

export interface CalculateOrderPreview {
  bnpl_plan_id: number
  amount: number
  period: number
  down_payment: number
}

export interface OrderPreviewResponse {
  monthly_payment: number
  total_amount: number
  interest_amount: number
  down_payment: number
  periods: {
    period: number
    amount: number
    due_date: string
  }[]
}

export interface PaymentRequest {
  amount: number
  payment_method: 'cash' | 'card'
  card_data?: {
    card_number: string
    card_holder: string
    expiry_month: number
    expiry_year: number
    cvv: string
  }
  notes?: string
}

export interface PaymentSummary {
  total_amount: number
  paid_amount: number
  remaining_amount: number
  payments: {
    id: number
    amount: number
    payment_method: string
    created_at: string
  }[]
}
