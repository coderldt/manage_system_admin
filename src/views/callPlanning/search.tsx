import { useEffect } from "react"
import { Button, Form, Input, Select, Space, DatePicker } from "antd"
import dayjs from "dayjs"
import { INLINE_FORM_ITEM_WIDTH } from "@/config"
import type { SearchType } from './types'
const { RangePicker } = DatePicker

interface SearchProps {
  handleSearch: (params: SearchType) => void
  handleReset: (params: SearchType) => void
}

const Search: React.FC<SearchProps> = (props) => {
  const [form] = Form.useForm()

  const layout = {
    labelCol: { span: 8 },
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    setTimeout(() => {
      const startTime = '2020-10-10'
      const endTime = '2021-10-10'

      form.setFieldsValue({ 'createTime': [dayjs(startTime), dayjs(endTime)] })
    }, 1000)
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
        <Form.Item name="callStatus" label="拜访状态" rules={[{ required: false }]}>
          <Select
            placeholder="请选择"
            style={{ width: `${INLINE_FORM_ITEM_WIDTH}px` }}
            allowClear
          >
            <Select.Option value="-1">全部</Select.Option>
            <Select.Option value="0">已完成</Select.Option>
            <Select.Option value="1">未完成</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="errorStatus" label="异常状态" rules={[{ required: false }]}>
          <Select
            placeholder="请选择"
            style={{ width: `${INLINE_FORM_ITEM_WIDTH}px` }}
            allowClear
          >
            <Select.Option value="-1">全部</Select.Option>
            <Select.Option value="1">正常</Select.Option>
            <Select.Option value="2">超时</Select.Option>
            <Select.Option value="3">定位</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="planDate" label="计划时间" rules={[{ required: false }]}>
          <RangePicker
            style={{ width: `${INLINE_FORM_ITEM_WIDTH}px` }}
            format={'YYYY-MM-DD'}
          />
        </Form.Item>
        <Form.Item name="createTime" label="创建时间" rules={[{ required: false }]} >
          <RangePicker
            format="YYYY-MM-DD"
            style={{ width: `${INLINE_FORM_ITEM_WIDTH}px` }}
          />
        </Form.Item>
        <Form.Item name="regionManager" label="区域经理" rules={[{ required: false }]} >
          <Input
            style={{ width: `${INLINE_FORM_ITEM_WIDTH}px` }}
            placeholder="请输入"
          />
        </Form.Item>
        <Form.Item name="callResaon" label="拜访原因" rules={[{ required: false }]} >
          <Input
            style={{ width: `${INLINE_FORM_ITEM_WIDTH}px` }}
            placeholder="请输入"
          />
        </Form.Item>
        <Form.Item name="name" label="经销商名称" rules={[{ required: false }]} >
          <Input
            style={{ width: `${INLINE_FORM_ITEM_WIDTH}px` }}
            placeholder="请输入"
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