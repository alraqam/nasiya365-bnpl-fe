import { useEffect, useState, useCallback } from 'react'
import { api } from 'src/configs/api'

const useFetch = <T>(url: string, auto = true, withBaseURL = true) => {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(
    async (newUrl: string = url) => {
      try {
        setLoading(true)
        const response = await api<T>(newUrl, {}, withBaseURL || false)
        setData(response)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [url]
  )

  useEffect(() => {
    if (auto) {
      fetchData()
    }
  }, [auto, fetchData])

  return { data, loading, fetchData }
}

export default useFetch
