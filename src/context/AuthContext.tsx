// ** React Imports
import { createContext, useState, ReactNode, useEffect } from 'react'

// ** Types
import { AuthValuesType, UserDataType } from './types'
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
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [permissions, setPermissions] = useState<Permission[]>(defaultProvider.permissions)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [token, setToken] = useState<string | null>(null)

  const fetchUser = async () => {
    setLoading(true)
    const res = (await api('/api/user')) as UserDataType
    setUser(res)
    setLoading(false)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(STORAGE_KEYS.token)
      setToken(storedToken)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (token && user === null) {
      fetchUser()
    }

    const cachedPermissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.permissions) || '[]') as Permission[]
    setPermissions(cachedPermissions)
  }, [token])

  // const getAllActions = (subject: string) => {
  //   const filtered = permissions.filter(p => p.subject === subject)
  //   return filtered
  // }

  // console.log(getAllActions('ProfileController'))

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
