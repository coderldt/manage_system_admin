import { useEffect, useState } from 'react'
import type { Pages } from '@/types'
import ajax from '@/tools/axios'
import { Code } from '@/enum'

interface Params {
  [key: string]: any
}

export interface Props<T> {
  url: string,
  method: 'get' | 'post'
  form?: Params
  pages?: Pages
  isPages?: boolean
  beforeRequest?: (params: Params) => Params
  afterRequest?: (params: any) => { data: T[], pages: Pages }
}

interface Options {
  immediate?: boolean
}

interface Result<T> {
  data: T[]
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

const useTable = <T>(props: Props<T>, options: Options = { immediate: true }): Result<T> => {

  const [pages, setPages] = useState({ ...defaultPages, ...props.pages })
  const [data, setData] = useState<T[]>([])
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

    if (res.code === Code.SUCCESS) {
      // let data = []
      // let page: Pages = {}
      if (afterRequest) {
        const result = afterRequest(res.data)
        setData(result.data)
        setPages(result.pages)

      } else {
        const { page, pageSize, total, list } = res.data as { page: number, pageSize: number, total: number, list: never[] }

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