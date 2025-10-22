/**
 * Investor and Investment types
 * Generated from Nasiya BNPL API - Investors & Investments modules
 */

export interface Investor {
  id: number
  name: string
  email?: string
  phone: string
  address?: string
  company_name?: string
  tax_id?: string
  total_invested: number
  total_returns: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateInvestorRequest {
  name: string
  phone: string
  email?: string
  address?: string
  company_name?: string
  tax_id?: string
}

export type UpdateInvestorRequest = Partial<CreateInvestorRequest>

export interface Investment {
  id: number
  investor_id: number
  amount: number
  investment_date: string
  return_date?: string
  interest_rate: number
  status: 'active' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
  investor?: Investor
}

export interface CreateInvestmentRequest {
  investor_id: number
  amount: number
  investment_date: string
  interest_rate: number
  return_date?: string
  notes?: string
}

export interface UpdateInvestmentRequest extends Partial<CreateInvestmentRequest> {
  status?: Investment['status']
}

export interface InvestorQueryParams {
  page?: number
  per_page?: number
  search?: string
  is_active?: boolean
}

export interface InvestmentQueryParams {
  page?: number
  per_page?: number
  investor_id?: number
  status?: Investment['status']
  date_from?: string
  date_to?: string
}
