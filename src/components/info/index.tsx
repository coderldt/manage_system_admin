import React from "react"
import { DownOutlined } from '@ant-design/icons'
import { User } from "@/types/info"
import { Dropdown, MenuProps, Space } from "antd"
import { useNavigate } from "react-router-dom"
import { setStore } from "@/tools/local"

interface Props {
  user: User
}

const Info: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate()
  const handlelogout = () => {
    setStore('token', '')
    navigate('/login')
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className="div" onClick={handlelogout}>退出登录</div>
      ),
    },
  ]

  return (
    <>
      <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            {user ? <div className="username">{user.username}</div> : ''}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </>
  )
}

export default Info
