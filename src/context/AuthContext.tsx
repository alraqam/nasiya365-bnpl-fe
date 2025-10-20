// ** React Imports
import { createContext, useState, ReactNode, useEffect, useCallback } from 'react'

// ** Types
import { AuthValuesType, CentralUser, TenantUser, User, UserType } from './types'
import { STORAGE_KEYS } from 'src/@core/utils/constants'
import { api } from 'src/configs/api'
import { Permission } from 'src/@core/utils/permission-checker'

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

  console.log(userType)
  console.log(user)

  const fetchUser = useCallback(async () => {
    setLoading(true)
    try {
      if (userType === 'central') {
        const res = (await api('/api/user')) as CentralUser
        setUser(res)
      }

      if (userType === 'tenant') {
        const res = (await api('/api/employee')) as TenantUser
        setUser(res)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [userType])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(STORAGE_KEYS.token)
      const storedUserType = localStorage.getItem(STORAGE_KEYS.user_type)

      setToken(storedToken)
      setUserType(storedUserType as UserType)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // If user authenticated, fetch user
    if (token && user === null) {
      fetchUser()
    }

    if (typeof window !== 'undefined') {
      const cachedPermissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.permissions) || '[]') as Permission[]
      setPermissions(cachedPermissions)
    }
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
