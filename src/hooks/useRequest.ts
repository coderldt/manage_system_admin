import { useEffect, useState } from "react"
import Ajax from '@/tools/axios'
import { Code } from '@/enum'

interface Result {
  data: any
  isLoading: boolean
  error: string | null
  reLoad: () => void
}

const useRequest = (url: string, methods: 'get' | 'post', params: { [key: string]: any } = {}, immediate = true): Result => {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await Ajax[methods](url, params)
      if (response.code !== Code.SUCCESS) {
        throw new Error('请求失败')
      }

      setData(response.data)
    } catch (err: any) {
      setError(err.message)
    }

    setLoading(false)
  };

  immediate && fetchData()

  return { data, isLoading, error, reLoad: fetchData }
}

export default useRequest