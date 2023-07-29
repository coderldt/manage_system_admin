import { Button, Form, Input, Space } from "antd"
import { INLINE_FORM_ITEM_WIDTH } from "@/config"
import type { SearchType } from './types'

interface SearchProps {
  handleSearch: (params: SearchType) => void
  handleReset: (params: SearchType) => void
}

const Search: React.FC<SearchProps> = (props) => {
  const [form] = Form.useForm<SearchType>()

  const layout = {
    labelCol: { span: 4 },
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  const onFinish = (values: SearchType) => {
    props.handleSearch(values)
  }

  const onReset = () => {
    form.resetFields()
    props.handleReset({})
  }

  return (
    <>
      <Form
        {...layout}
        form={form}
        layout="inline"
        name="control-hooks"
        onFinish={onFinish}
      >
        <Form.Item name="role_name" label="角色名" rules={[{ required: false }]}>
          <Input placeholder='请输入' style={{ width: `${INLINE_FORM_ITEM_WIDTH}px` }}></Input>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default Search