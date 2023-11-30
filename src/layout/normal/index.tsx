import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Button, Layout } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import Menu from '@/components/menu'
import Logo from '@/components/logo'
import Info from '@/components/info'
import { getInfo } from '@/store/reducer/info'
import { useAppDispath, useAppState } from '@/hooks'
import './index.less'
const { Header, Sider, Content } = Layout

const NormalLayout = () => {
  const info = useAppState((state) => state.info.info)
  const [collapsed, setCollapsed] = useState(false)

  const dispath = useAppDispath()
  useEffect(() => {
    dispath(getInfo())
  }, [])

  return (
    <>
      <Layout className='normal' style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <Logo />
          <Menu />
        </Sider>
        <Layout style={{ height: '100vh' }}>
          <Header className='normal-header'>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <div className="info">
              <Info user={info.user} />
            </div>
          </Header>
          <Content className='normal-content' >
            <div className="normal-view">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  )

}

export default NormalLayout
