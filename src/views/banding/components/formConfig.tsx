import { forwardRef } from 'react'
import { Form, Input, Radio } from 'antd'
import { INLINE_FORM_ITEM_WIDTH } from '@/config'
import { FormConfigRefProps, SearchForm } from '../type.d'

const FormConfig = forwardRef<FormConfigRefProps>((_, ref) => {
  const [form] = Form.useForm<SearchForm>()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  }

  return (
    <>
      <Form
        {...layout}
        form={form}
        labelAlign='left'
        name="control-hooks"
        ref={ref}
      >
        <Form.Item name="brandCount" initialValue={3} label="班级数量" rules={[{ required: true }]}>
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
      </Form>
    </>
  )
})

export default FormConfig
