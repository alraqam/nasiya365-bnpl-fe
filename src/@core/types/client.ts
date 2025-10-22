/**
 * Client types
 * Generated from Nasiya BNPL API - Clients module
 */

export interface Client {
  id: number
  first_name: string
  last_name: string
  phone: string
  passport: string
  address: string
  created_at: string
  updated_at: string
  status?: 'active' | 'inactive' | 'blocked'
  email?: string
  date_of_birth?: string
  place_of_issue?: string
  date_of_issue?: string
  file_passport?: string
  place_of_birth?: string
  place_of_registration?: string
  place_of_residence?: string
  workplace?: string
  specialization?: string
  gender?: 0 | 1 // 0: female, 1: male
  middle_name?: string
}

export interface CreateClientRequest {
  first_name: string
  last_name: string
  phone: string
  passport: string
  address: string
  email?: string
  date_of_birth?: string
  gender?: 0 | 1
  middle_name?: string
  place_of_issue?: string
  date_of_issue?: string
  place_of_birth?: string
  place_of_registration?: string
  place_of_residence?: string
  workplace?: string
  specialization?: string
}

export type UpdateClientRequest = Partial<CreateClientRequest>

export interface ClientQueryParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  passport?: string
  phone?: string
}
