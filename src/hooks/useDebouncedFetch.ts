import { useEffect, useState, useCallback, useRef } from 'react'
import { api } from 'src/configs/api'
import { logger } from 'src/@core/utils/logger'
import toast from 'react-hot-toast'

interface UseDebouncedFetchOptions {
  auto?: boolean
  withBaseURL?: boolean
  delay?: number
  watch?: any[] // variables to watch and trigger fetch
}

const useDebouncedFetch = <T>(url: string, options: UseDebouncedFetchOptions = {}) => {
  const { auto = true, withBaseURL = true, delay = 700, watch = [] } = options

  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(
    async (newUrl: string = url) => {
      try {
        setLoading(true)
        setError(null)
        const response = await api<T>(newUrl, {}, withBaseURL)
        setData(response)
      } catch (err) {
        logger.error('Debounced fetch error:', err)
        setError(err as Error)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    },
    [url, withBaseURL]
  )

  const debouncedFetch = useCallback(
    (newUrl?: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        fetchData(newUrl)
      }, delay)
    },
    [fetchData, delay]
  )

  // Automatically call on mount if auto = true
  useEffect(() => {
    if (auto) debouncedFetch()
  }, [auto, debouncedFetch])

  // Watch additional dependencies and trigger fetch
  useEffect(() => {
    if (watch.length > 0) {
      debouncedFetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...watch, debouncedFetch])

  return { data, loading, error, fetchData: debouncedFetch }
}

export default useDebouncedFetch
