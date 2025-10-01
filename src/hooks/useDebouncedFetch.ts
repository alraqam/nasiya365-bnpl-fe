import { useEffect, useState, useCallback, useRef } from 'react'
import { api } from 'src/configs/api'

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
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(
    async (newUrl: string = url) => {
      try {
        setLoading(true)
        const response = await api<T>(newUrl, {}, withBaseURL)
        setData(response)
      } catch (err) {
        console.error(err)
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
  }, [...watch, debouncedFetch])

  return { data, loading, fetchData: debouncedFetch }
}

export default useDebouncedFetch
