import { Button, Form, Space } from "antd"
import type { SearchType } from './types'

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

  const onReset = () => {
    props.handleReset({})
  }

  return (
    <>
      <Form
        {...layout}
        form={form}
        layout="inline"
        name="control-hooks"
      >
        <Form.Item {...tailLayout}>
          <Space>
            <Button htmlType="button" type="primary" onClick={onReset}>
              刷新
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default Search