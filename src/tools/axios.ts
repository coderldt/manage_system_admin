import axios, { InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { Code } from '@/enum'
import { getStore } from './local'

interface Result<R> {
  code: number
  data: R
  msg: string
}

axios.defaults.withCredentials = true

axios.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    const token = getStore('token')
    config.headers.token = token
    return config
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    switch (response.status) {
      case 200:
        // 返回数据
        // 去权限返回状态码
        if (response.data.code == Code.INVALID_TOKEN) {
          message.warning('登录状态已失效，请登录后再来访问')
          setTimeout(() => {
            window.location.href = '/systemAdmin/login'
          }, 2000)
        }
        if (response.data.code == Code.NO_PERMISSION) {
          window.location.href = '/402'
        }
        if (response.data.code == Code.NO_FIND) {
          window.location.href = '/404'
        }
        break
      default:
        response.data = {
          status: 504,
          data: '网络请求出错'
        }
        break
    }
    return Promise.resolve(response.data)
  },
  error => {
    const {message}=error
    if(message==='Request failed with status code 403'){
      return Promise.reject({
        status: 403,
        data: {
          data: '请先登录',
          status: 504
        }
      })
    }else{
      return Promise.reject({
        status: 504,
        data: {
          data: '网络请求出错',
          status: 504
        }
      })
    }

  }
)
const ajax = {
  get: <R, P>(url: string, params?: P): Promise<Result<R>> => {
    return axios.get(url, { params })
  },
  post: <R, P = any>(url: string, params?: P): Promise<Result<R>> => {
    return axios.post(url, params)
  },
}

export default ajax
