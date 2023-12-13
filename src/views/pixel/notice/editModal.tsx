import { useState } from "react"
import { Button, Form, Input, Modal, Radio, Select, message } from "antd"
import { Code, Status } from "@/enum"
import ajax from "@/tools/axios"
import request from '@/request'
import { ModalType, type Columns, type NoticeForm } from './types.d'
import { niticeTypeOptions } from "@/enum/pixel"

const { TextArea } = Input

interface Props {
  mode: keyof typeof ModalType
  data?: Columns
  refrensh: (initPage: boolean) => void
}

const EditModal: React.FC<Props> = ({ mode, data, refrensh }) => {
  const [show, setShow] = useState(false)
  const [form] = Form.useForm<NoticeForm>()

  const showModal = () => {
    setShow(true)
    form.resetFields()
    if (mode !== 'add') {
      getDetail()
    }
  }

  const getDetail = async () => {
    const res = await ajax.post<NoticeForm>(request.pixel.notice.detail, { notice_id: data?.notice_id })
    if (res.code === Code.SUCCESS) {
      form.setFieldsValue(res.data)
    }
  }

  const handleSave = () => {
    form.validateFields()
      .then(async values => {
        let res = null
        if (mode === 'add') {
          res = await ajax.post(request.pixel.notice.add, values)
        } else if (mode === 'edit') {
          res = await ajax.post(request.pixel.notice.update, { ...values, notice_id: data?.notice_id })
        }

        if (res && res.code === Code.SUCCESS) {
          message.success(`${mode === 'add' ? '添加' : '更新'}成功`)
          refrensh(mode !== 'add')
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
      <Button onClick={showModal} type={mode === 'add' ? 'primary' : undefined}>{ModalType[mode]}</Button>
      <Modal
        title={ModalType[mode]}
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
          <Form.Item name="notice_title" label="通知内容" rules={[{ required: true, message: '通知内容不能为空' }]}>
            <TextArea rows={4} placeholder="请输入" showCount disabled={mode === 'detail'} maxLength={100} />
          </Form.Item>
          <Form.Item name="notice_type" label="通知类型" rules={[{ required: true, message: '通知类型不能为空' }]}>
            <Select
              placeholder="请选择"
              options={niticeTypeOptions}
              disabled={mode === 'detail'}
              allowClear
            />
          </Form.Item>
          <Form.Item name="status" label="通知状态" initialValue={Status.ENABLE} rules={[{ required: true, message: '通知状态不能为空' }]}>
            <Radio.Group disabled={mode === 'detail'}>
              <Radio value={Status.ENABLE}>开启</Radio>
              <Radio value={Status.DISABLE}>关闭</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditModal
