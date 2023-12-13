import { useState } from "react"
import { Button, Form, Input, InputNumber, Modal, Radio, Select, message } from "antd"
import { Code, Status } from "@/enum"
import ajax from "@/tools/axios"
import request from '@/request'
import type { Columns, Detail, UserForm } from './types'

interface Props {
  mode: 'add' | 'edit' | 'detail'
  imgTypeDict: Columns[]
  data?: Columns
  refrensh: (initPage: boolean) => void
}

const EditModal: React.FC<Props> = ({ mode, data, imgTypeDict, refrensh }) => {
  const [show, setShow] = useState(false)
  const [form] = Form.useForm<UserForm>()

  const showModal = () => {
    setShow(true)
    form.resetFields()
    if (mode !== 'add') {
      getDetail()
    }
  }

  const getDetail = async () => {
    const res = await ajax.post<Detail, { typeId: React.Key | undefined }>(request.pixel.cartoniza.detail, { typeId: data?.typeId })
    if (res.code === Code.SUCCESS) {
      form.setFieldsValue(res.data.detail as UserForm)
    }
  }

  const handleSave = () => {
    form.validateFields()
      .then(async values => {
        let res = null
        if (mode === 'add') {
          res = await ajax.post(request.pixel.cartoniza.add, values)
        } else if (mode === 'edit') {
          res = await ajax.post(request.pixel.cartoniza.update, { ...values, typeId: data?.typeId })
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
      <Button onClick={showModal} type={mode === 'add' ? 'primary' : undefined}>{mode === 'add' ? '新增' : mode === 'detail' ? '详情' : '编辑'}</Button>
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
          initialValues={{
            isRecommend: '1',
            status: Status.ENABLE
          }}
          name="control-hooks"
        >
          <Form.Item name="label" label="名称" rules={[{ required: true, message: '请输入名称!' }]}>
            <Input placeholder='请输入' disabled={mode === 'detail'} ></Input>
          </Form.Item>
          <Form.Item name="value" label="值" rules={[{ required: true, message: '请输入值!' }]}>
            <Input placeholder='请输入' disabled={mode === 'detail'} ></Input>
          </Form.Item>
          <Form.Item name="parentId" label="父级" rules={[{ required: false, message: '请输入电话' }]}>
            <Select
              options={imgTypeDict}
              disabled={mode === 'detail'}
              fieldNames={{ value: 'typeId' }}
            />
          </Form.Item>
          <Form.Item name="sort" label="排序" initialValue={1} rules={[{ required: true, message: '排序不能为空' }]}>
            <InputNumber style={{ width: '100%' }} disabled={mode === 'detail'} />
          </Form.Item>
          <Form.Item name="isRecommend" label="是否推荐" rules={[{ required: true, message: '请选择是否推荐!' }]}>
            <Radio.Group disabled={mode === 'detail'}>
              <Radio value={'1'}>是</Radio>
              <Radio value={'2'}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="status" label="是否上架" rules={[{ required: true, message: '请选择是否上架!' }]}>
            <Radio.Group disabled={mode === 'detail'}>
              <Radio value={Status.ENABLE}>是</Radio>
              <Radio value={Status.DISABLE}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditModal
