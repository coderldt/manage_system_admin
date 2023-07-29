import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Button, Layout } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import Menu from '@/components/menu'
import Logo from '@/components/logo'
import { getInfo } from '@/store/reducer/info'
import { useAppDispath } from '@/hooks'
import './index.less'
const { Header, Sider, Content } = Layout

const headerStyle: React.CSSProperties = {
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#fff',
  paddingLeft: '0',
  paddingRight: '0'
}

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  height: 'auto',
  marginTop: '20px',
  color: '#878282',
  padding: '10px'
}

const ErrorLayout = () => {
  return (
    <>
      <Layout className='error' style={{ minHeight: '100vh' }}>
        <Layout style={{ height: '100vh' }}>
          <Header style={headerStyle}>
          </Header>
          <Content className='error-content' >
            <div className="error-view">
              <Outlet />
            </div>
            <div id="footer" style={footerStyle}>
              Ant Design ©2023 Created by Ant UED
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  )

}

export default ErrorLayout
