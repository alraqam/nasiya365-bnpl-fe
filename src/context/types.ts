import { Permission } from 'src/@core/utils/permission-checker'

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export interface IMerchant {
  id: number
  name: string
  logo: null | string
  domain: string
  subdomain: string
  colors: string
  user_id: number
  schema_name: string
  merchant_uid: string
  billing_id: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface CentralUser {
  id: number
  name: string
  surname: string
  middle_name: null | string
  email: null | string
  phone1: string
  phone2: null | string
  email_verified_at: null | string
  passport: string
  place_of_issue: null | string
  date_of_issue: null | string
  date_of_birth: string
  gender: number
  place_of_birth: null | string
  place_of_residence: null | string
  family_status: null | string
  number_of_children: null | string
  status: number
  created_at: string
  updated_at: string
  role_id: number
  role: {
    id: number
    name: string
    label: string
    created_at: string
    updated_at: string
  }
}

export interface TenantUser {
  id: number
  name: string
  sur_name: string
  phone: string
  email: string
  photo: null | string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export type User = CentralUser | TenantUser
export type UserType = 'central' | 'tenant'

export type AuthValuesType = {
  loading: boolean
  user: User | null
  setLoading: (value: boolean) => void
  setUser: (value: User | null) => void
  permissions: Permission[]
  setPermissions: (value: Permission[]) => void
}
