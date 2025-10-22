/**
 * Authentication Service
 * Handles authentication for both Central and Employee logins
 * Generated from Nasiya BNPL API - Authentication module
 */

import { api } from 'src/configs/api'
import { LoginRequest, LoginResponse, RegisterRequest, AuthUser } from 'src/@core/types/auth'

export const authService = {
  /**
   * Central user login
   */
  centralLogin: (credentials: LoginRequest) =>
    api<LoginResponse>('/api/central/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  /**
   * Central user registration
   */
  centralRegister: (data: RegisterRequest) =>
    api<LoginResponse>('/api/central/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  /**
   * Central user logout
   */
  centralLogout: () =>
    api('/api/central/logout', {
      method: 'POST'
    }),

  /**
   * Employee login with tenant schema
   */
  employeeLogin: (credentials: LoginRequest & { company_schema: string }) =>
    api<LoginResponse>(`/api/employee/login?tenant=${credentials.company_schema}`, {
      method: 'POST',
      body: JSON.stringify({
        phone: credentials.phone,
        password: credentials.password
      })
    }),

  /**
   * Employee logout
   */
  employeeLogout: () =>
    api('/api/employee/logout', {
      method: 'POST'
    }),

  /**
   * Get current employee details
   */
  employeeMe: () =>
    api<{ data: AuthUser }>('/api/employee/me', {
      method: 'GET'
    }),

  /**
   * Get current central user details
   */
  centralMe: () =>
    api<{ data: AuthUser }>('/api/central/me', {
      method: 'GET'
    })
}

