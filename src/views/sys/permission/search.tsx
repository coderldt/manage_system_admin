import { Button, Form, Input, Space } from "antd"

interface SearchProps {
  handleExpand: (type?: 'all' | 'clean') => void
}

const Search: React.FC<SearchProps> = (props) => {
  // const [form] = Form.useForm()

//   const layout = {
//     labelCol: { span: 4 },
//   }
//
//   const tailLayout = {
//     wrapperCol: { offset: 8, span: 16 },
//   }
//
//   const onFinish = (values: SearchType) => {
//     // props.handleSearch(values)
//   }
//
//   const onReset = () => {
//     form.resetFields()
//     // props.handleReset({})
//   }

  return (
    <>
      <Space>
        <Button  onClick={() => props.handleExpand('all')}>
          全部展开
        </Button>
        <Button onClick={() => props.handleExpand('clean')}>
          全部折叠
        </Button>
      </Space>
      {/* <Form
        {...layout}
        form={form}
        layout="inline"
        name="control-hooks"
        onFinish={onFinish}
      >
        <Form.Item name="username" label="用户" rules={[{ required: false }]}>
          <Input placeholder='请输入' style={{ width: `${INLINE_FORM_ITEM_WIDTH}px` }}></Input>
        </Form.Item>
        <Form.Item name="phone" label="电话" rules={[{ required: false }]}>
          <Input placeholder='请输入' style={{ width: `${INLINE_FORM_ITEM_WIDTH}px` }}></Input>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" onClick={onReset}>
              全部展开
            </Button>
            <Button htmlType="button" onClick={onReset}>
              全部折叠
            </Button>
          </Space>
        </Form.Item>
      </Form> */}
    </>
  )
}

export default Search