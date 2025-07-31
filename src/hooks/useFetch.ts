import { useEffect, useState } from 'react'
import { api } from 'src/configs/api'

const useFetch = <T>(url: string, auto = true) => {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(false)

  const fetchData = async (newUrl: string = url) => {
    try {
      setLoading(true)
      const response = await api<T>(newUrl)
      setData(response)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auto) {
      fetchData()
    }
  }, [auto, url])

  return { data, loading, fetchData }
}

export default useFetch
