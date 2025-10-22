// ** React Imports
import { createContext, useState, ReactNode, useEffect, useCallback } from 'react'

// ** Types
import { AuthValuesType, CentralUser, TenantUser, User, UserType } from './types'
import { STORAGE_KEYS } from 'src/@core/utils/constants'
import { api } from 'src/configs/api'
import { Permission } from 'src/@core/utils/permission-checker'
import { storage } from 'src/@core/utils/storage'
import { logger } from 'src/@core/utils/logger'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  permissions: [],
  setPermissions: () => []
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<User | null>(defaultProvider.user)
  const [userType, setUserType] = useState<UserType>()

  const [permissions, setPermissions] = useState<Permission[]>(defaultProvider.permissions)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  const fetchUser = useCallback(async () => {
    setLoading(true)
    try {
      if (userType === 'central') {
        const response = await api<{ data: CentralUser }>('/api/central/me')
        setUser(response.data)
      }

      if (userType === 'tenant') {
        const response = await api<{ data: TenantUser }>('/api/employee/me')
        setUser(response.data)
      }
    } catch (error) {
      logger.error('Failed to fetch user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [userType])

  useEffect(() => {
    const storedToken = storage.getItem(STORAGE_KEYS.token)
    const storedUserType = storage.getItem(STORAGE_KEYS.user_type)

    setToken(storedToken)
    setUserType(storedUserType as UserType)
    setLoading(false)
  }, [])

  useEffect(() => {
    // If user authenticated, fetch user
    if (token && user === null) {
      fetchUser()
    }

    const cachedPermissions = storage.getJSON<Permission[]>(STORAGE_KEYS.permissions) || []
    setPermissions(cachedPermissions)
  }, [token, user, fetchUser])

  const getAllActions = (subject: string) => {
    const filtered = permissions.filter(p => p.subject === subject)
    return filtered
  }

  const getUniqueSubjects = () => {
    const uniqueSubjects = new Set(permissions.map(p => p.subject))
    return Array.from(uniqueSubjects)
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    permissions,
    setPermissions
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
