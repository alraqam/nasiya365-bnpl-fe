import { User } from 'src/@core/types/auth'
import { PermissionGroups } from 'src/@core/utils/permission-checker'

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type AuthValuesType = {
  loading: boolean
  user: User | null
  setLoading: (value: boolean) => void
  setUser: (value: User | null) => void
  permissions: PermissionGroups
  setPermissions: (value: PermissionGroups) => void
}
