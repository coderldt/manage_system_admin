import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import './index.less'
const { Header, Content } = Layout

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
