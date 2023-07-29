import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCn from 'antd/locale/zh_CN'
import { Provider } from 'react-redux'
import { BrowserRouter, Outlet } from 'react-router-dom'
import 'antd/dist/reset.css'
import '@/assets/css/common.less'
import './index.less'
import Routes from './routers'
import store from './store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <ConfigProvider locale={zhCn} componentSize='middle'>
    <Provider store={store}>
      <BrowserRouter>
        <Routes />
        <Outlet />
      </BrowserRouter>
    </Provider>
  </ConfigProvider>
  // </React.StrictMode>,
)
