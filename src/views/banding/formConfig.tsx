import React from 'react'
import { Button, Form, Input, Radio, Space, message } from 'antd'
import { INLINE_FORM_ITEM_WIDTH } from '@/config'
import { FormConfigProps, SearchForm } from './type.d'

const FormConfig: React.FC<FormConfigProps> = ({ saveFormConfig }) => {
  const [form] = Form.useForm<SearchForm>()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  }

  const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
  }

  const onFinish = (form: SearchForm) => {
    console.log('form', form)
    saveFormConfig(form)
  }

  const onReset = () => {
    form.resetFields()
    // props.handleReset({})
  }

  return (
    <>
      <div className="form-config">
        <Form
          {...layout}
          form={form}
          labelAlign='left'
          name="control-hooks"
          onFinish={onFinish}
        >
          <Form.Item name="brandCount" initialValue={'1'} label="班级数量" rules={[{ required: true }]}>
            <Input placeholder='请输入输入班级数量' style={{ width: `${INLINE_FORM_ITEM_WIDTH}px` }}></Input>
          </Form.Item>
          <Form.Item name="isDisruption" initialValue={1} label="是否打乱" rules={[{ required: true }]}>
            <Radio.Group >
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="sexBalance" initialValue={1} label="是否男女平衡" rules={[{ required: true }]}>
            <Radio.Group >
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button htmlType="button" onClick={onReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default FormConfig
