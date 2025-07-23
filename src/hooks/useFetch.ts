import { useEffect, useState } from 'react'
import { api } from 'src/configs/api'

const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await api(url)
      const data = await response.json()
      setData(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return { data, loading, fetchData }
}

export default useFetch
