import { Button, Form, Select, Space } from "antd"
import { INLINE_FORM_ITEM_WIDTH } from "@/config"
import type { SearchType } from './types'
import { niticeTypeOptions } from "@/enum/pixel"

interface SearchProps {
  handleSearch: (params: SearchType) => void
  handleReset: (params: SearchType) => void
}

const Search: React.FC<SearchProps> = (props) => {
  const [form] = Form.useForm<SearchType>()

  const layout = {
    labelCol: { span: 6 },
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
        <Form.Item name="notice_type" label="通知类型" rules={[{ required: false }]}>
          <Select
            style={{ width: `${INLINE_FORM_ITEM_WIDTH}px` }}
            placeholder="请选择"
            options={niticeTypeOptions}
            allowClear
          />
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