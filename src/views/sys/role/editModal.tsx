import { useState } from "react"
import { Button, Form, Input, Modal, message } from "antd"
import { ButtonProps } from "antd/lib/button"
import { Code } from "@/enum"
import ajax from "@/tools/axios"
import request from '@/request'
import type { Columns, SearchType } from './types'

interface Props {
  mode: 'add' | 'edit' | 'detail'
  btnProps?: ButtonProps
  data?: Columns
  refrensh: () => void
}

const EditModal: React.FC<Props> = ({ mode, data, btnProps, refrensh }) => {
  const [show, setShow] = useState(false)
  const [form] = Form.useForm<SearchType>()

  const showModal = () => {
    setShow(true)
    form.resetFields()
    if (mode !== 'add') {
      getDetail()
    }
  }

  const getDetail = async () => {
    const res = await ajax.post(request.sys.role.detail, { role_id: data?.role_id })
    if (res.code === Code.SUCCESS) {
      form.setFieldsValue(res.data as SearchType)
    }
  }

  const handleSave = () => {
    form.validateFields()
      .then(async values => {
        let res = null
        if (mode === 'add') {
          res = await ajax.post(request.sys.role.add, values)
        } else if (mode === 'edit') {
          res = await ajax.post(request.sys.role.update, { ...values, role_id: data?.role_id })
        }

        if (res && res.code === Code.SUCCESS) {
          message.success(`${mode === 'add' ? '添加' : '更新'}成功`)
          refrensh()
          setShow(false)
        } else {
          message.error(res && res.msg)
        }
      })
      .catch(error => {
        console.log('Validation failed:', error)
      })
  }

  const layout = {
    labelCol: { span: 4 },
  }

  const handleCancel = () => {
    setShow(false)
  }

  return (
    <>
      <Button onClick={showModal} type={mode === 'add' ? 'primary' : undefined} {...btnProps}>{mode === 'add' ? '新增' : mode === 'detail' ? '详情' : '编辑'}</Button>
      <Modal
        title={mode === 'add' ? '新增' : mode === 'detail' ? '详情' : '编辑'}
        open={show}
        onOk={handleSave}
        onCancel={handleCancel}
        okButtonProps={{ style: { display: mode === 'detail' ? 'none' : 'inline-block' } }}
      >
        <Form
          {...layout}
          form={form}
          name="control-hooks"

        >
          <Form.Item name="role_name" label="角色名" rules={[{ required: true, message: '请输入姓名!' }]}>
            <Input placeholder='请输入' disabled={mode === 'detail'} ></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditModal
