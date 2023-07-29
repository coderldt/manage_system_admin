import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, message } from "antd"
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Code } from "@/enum"
import ajax from "@/tools/axios"
import request from '@/request'
import { Info } from "@/types/info"
import { LoginForm } from "./type.d"
import './index.less'
import { setStore } from "@/tools/local"

const Login = () => {
  const [form] = Form.useForm<LoginForm>()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const navigate = useNavigate()

  const layout = {
    labelCol: { span: 4 },
  }

  const handleLogin = () => {
    form.validateFields().then(values => {
      ajax.post<{ token: string, userInfo: Info }>(request.sys.user.login, values).then(res => {
        if (res.code === Code.SUCCESS) {
          message.success('登录成功')
          setStore('token', res.data.token)
          navigate('/')
        } else {
          message.error(res.msg)
        }
      })
    })
  }

  return (
    <>
      <div className="login-container">
        <Form
          {...layout}
          form={form}
          initialValues={{
            username: '1234',
            password: '1234567',
          }}
          className="login-form"
          name="control-hooks"
        >
          <Form.Item >
            <div className="title">
              系统登录
            </div>
          </Form.Item>
          <Form.Item name="username" label="" rules={[{ required: true, message: '请输入姓名!' }]}>
            <Input placeholder="用户名" size="large" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item name="password" label="" rules={[{ required: true, message: '请输入电话' }]}>
            <Input.Password
              placeholder="密码"
              size="large"
              prefix={<LockOutlined />}
              visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
            />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" size="large" onClick={handleLogin}>登录</Button>
          </Form.Item>
        </Form>
      </div>
      <h2>login</h2>
    </>
  )
}

export default Login
