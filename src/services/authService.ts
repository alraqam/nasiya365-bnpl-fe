/**
 * Authentication Service
 * Handles authentication for both Central and Employee logins
 * Generated from Nasiya BNPL API - Authentication module
 */

import { api } from 'src/configs/api'
import {
  LoginRequest,
  RegisterRequest,
  AuthUser,
  CentralLoginResponse,
  EmployeeLoginResponse
} from 'src/@core/types/auth'

export const authService = {
  /**
   * Central user login
   */
  centralLogin: (credentials: LoginRequest) =>
    api<CentralLoginResponse>('/api/central/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  /**
   * Central user registration
   */
  centralRegister: (data: RegisterRequest) =>
    api<CentralLoginResponse>('/api/central/register', {
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
  employeeLogin: (credentials: LoginRequest) =>
    api<EmployeeLoginResponse>(`/api/employee/login`, {
      method: 'POST',
      body: JSON.stringify({
        phone: credentials.phone,
        password: credentials.password
      }),
      headers: {
        'X-Tenant-ID': 'demo'
      }
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
