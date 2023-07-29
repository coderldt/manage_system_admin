import { useEffect, useState } from 'react'
import type { CommonTableListRes, Pages } from '@/types'
import ajax from '@/tools/axios'
import useRequest from './useRequest'
import { Code } from '@/enum'

interface Params {
  [key: string]: any
}

interface Props {
  url: string,
  method: 'get' | 'post'
  form?: Params
  pages?: Pages
  isPages?: boolean
  beforeRequest?: (params: Params) => Params
  afterRequest?: (params: any) => { data: any, pages: Pages }
}

interface Options {
  immediate?: boolean
}

interface Result {
  data: any[]
  pages: Pages
  isLoading: boolean
  handleSearch: (params: Params) => void
  handleRefrensh: () => void
  handlePageChange: (params: Omit<Pages, 'total'>) => void
}

const defaultPages: Pages = {
  page: 1,
  pageSize: 10,
  total: 0
}

const useTable = (props: Props, options: Options = { immediate: true }): Result => {

  const [pages, setPages] = useState({ ...defaultPages, ...props.pages })
  const [data, setData] = useState([])
  const [form, setForm] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const { url, method, isPages = true, beforeRequest, afterRequest } = props
  const { immediate } = options

  const getList = async (props: { form?: Params, pages?: Pages } = {}) => {
    let params: Params = {
      ...props.form || form,
    }

    if (isPages) {
      params = {
        ...params,
        ...{ ...pages, ...props.pages},
      }
    }

    if (beforeRequest) {
      params = beforeRequest(params)
    }

    setIsLoading(true)

    const res = await ajax[method](url, params)
    console.log("🚀 ~ file: useTable.ts:68 ~ getList ~ res:", res)

    if (res.code === Code.SUCCESS) {
      // let data = []
      // let page: Pages = {}
      if (afterRequest) {
        const result = afterRequest(res.data)
        setData(result.data)
        setPages(result.pages)

      } else {
        const { page, pageSize, total, list } = res.data
        console.log("🚀 ~ file: useTable.ts:79 ~ getList ~ page, pageSize, total, list:", total, list)

        setData(list)
        setPages({
          page,
          pageSize,
          total
        })
      }
      setForm(form)
    }

    setIsLoading(false)
  }
  useEffect(() => {
    if (immediate) {
      getList()
    }
  }, [])


  const handleSearch = (params: Params) => {
    getList({ form: params, pages: { page: 1 } })
  }
  const hadnleReset = () => {
    getList({ pages: { page: 1 } })
  }
  const handlePageChange = (pages: Omit<Pages, 'total'> = {}) => {
    getList({ pages })
  }


  return {
    data,
    pages,
    isLoading,
    handleSearch,
    handleRefrensh: getList,
    handlePageChange
  }
}

export default useTable