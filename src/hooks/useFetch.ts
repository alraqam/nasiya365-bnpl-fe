import { useEffect, useState, useCallback } from 'react'
import { api } from 'src/configs/api'
import { logger } from 'src/@core/utils/logger'
import toast from 'react-hot-toast'

const useFetch = <T>(url: string, auto = true, withBaseURL = true) => {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(
    async (newUrl: string = url) => {
      try {
        setLoading(true)
        setError(null)
        const response = await api<T>(newUrl, {}, withBaseURL || false)
        setData(response)
      } catch (err) {
        logger.error('Fetch error:', err)
        setError(err as Error)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    },
    [url, withBaseURL]
  )

  useEffect(() => {
    if (auto) {
      fetchData()
    }
  }, [auto, fetchData])

  return { data, loading, error, fetchData }
}

export default useFetch
