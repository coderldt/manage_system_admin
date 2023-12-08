import { useEffect, useState } from "react"
import { Button, Form, Input, Modal, Select, message } from "antd"
import { Code } from "@/enum"
import ajax from "@/tools/axios"
import request from '@/request'
import { CommonTableListRes } from "@/types"
import CustomModal from '@/components/modal'
import type { Columns as RoleColumns } from '@/views/sys/role/types'
import type { Columns, UserForm, UserDetail } from './types'

interface Props {
  mode: 'add' | 'edit' | 'detail'
  data?: Columns
  refrensh: (initPage: boolean) => void
}

const EditModal: React.FC<Props> = ({ mode, data, refrensh }) => {
  const [show, setShow] = useState(false)
  const [roles, setRoles] = useState<RoleColumns[]>([])
  const [form] = Form.useForm<UserForm>()

  useEffect(() => {
    console.log(show, "show")
    if (show) {

      form.resetFields()
      if (mode !== 'add') {
        getDetail()
      }
      getRoles()
    }
  }, [show])

  const getDetail = async () => {
    const res = await ajax.post<UserDetail, { user_id: React.Key | undefined }>(request.sys.user.detail, { user_id: data?.user_id })
    if (res.code === Code.SUCCESS) {
      const { role_ids, ...parmas } = res.data
      form.setFieldsValue({
        ...parmas,
        role_ids: role_ids.split(',').filter(i => i)
      })
    }
  }

  const getRoles = async () => {
    const res = await ajax.post<CommonTableListRes<RoleColumns>>(request.sys.role.list)
    if (res.code === Code.SUCCESS) {
      res.data.list
      setRoles(res.data.list)
    }
  }

  const handleSave = () => {
    form.validateFields()
      .then(async values => {
        const { role_ids, ...params } = values
        let res = null
        if (mode === 'add') {
          res = await ajax.post(request.sys.user.add, { ...params, role_ids: role_ids.join(',') })
        } else if (mode === 'edit') {
          res = await ajax.post(request.sys.user.update, { ...params, role_ids: role_ids.join(','), user_id: data?.user_id })
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
    <CustomModal
      visible={show}
      title={mode === 'add' ? '新增' : mode === 'detail' ? '详情' : '编辑'}
      content={
        <Form
          {...layout}
          form={form}
          name="control-hooks"
        >
          <Form.Item name="username" label="姓名" rules={[{ required: true, message: '请输入姓名!' }]}>
            <Input placeholder='请输入' disabled={mode === 'detail'} ></Input>
          </Form.Item>
          <Form.Item name="phone" label="电话" rules={[{ required: true, message: '请输入电话' }]}>
            <Input placeholder='请输入' disabled={mode === 'detail'} ></Input>
          </Form.Item>
          <Form.Item name="role_ids" initialValue={[]} label="角色" rules={[{ required: false, message: '请选择电话' }]}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="请选择"
              disabled={mode === 'detail'}
              fieldNames={{ label: 'role_name', value: 'role_id' }}
              options={roles}
            />
          </Form.Item>
        </Form>
      }
      onOk={handleSave}
      onCancel={handleCancel}
    />
    // <>
    //   <Button onClick={showModal} type={mode === 'add' ? 'primary' : undefined}>{mode === 'add' ? '新增' : mode === 'detail' ? '详情' : '编辑'}</Button>
    //   <Modal
    //     title={mode === 'add' ? '新增' : mode === 'detail' ? '详情' : '编辑'}
    //     open={show}
    //     onOk={handleSave}
    //     onCancel={handleCancel}
    //     okButtonProps={{ style: { display: mode === 'detail' ? 'none' : 'inline-block' } }}
    //   >
    //     <Form
    //       {...layout}
    //       form={form}
    //       name="control-hooks"
    //     >
    //       <Form.Item name="username" label="姓名" rules={[{ required: true, message: '请输入姓名!' }]}>
    //         <Input placeholder='请输入' disabled={mode === 'detail'} ></Input>
    //       </Form.Item>
    //       <Form.Item name="phone" label="电话" rules={[{ required: true, message: '请输入电话' }]}>
    //         <Input placeholder='请输入' disabled={mode === 'detail'} ></Input>
    //       </Form.Item>
    //       <Form.Item name="role_ids" initialValue={[]} label="角色" rules={[{ required: false, message: '请选择电话' }]}>
    //         <Select
    //           mode="multiple"
    //           allowClear
    //           style={{ width: '100%' }}
    //           placeholder="请选择"
    //           disabled={mode === 'detail'}
    //           fieldNames={{ label: 'role_name', value: 'role_id' }}
    //           options={roles}
    //         />
    //       </Form.Item>
    //     </Form>
    //   </Modal>
    // </>
  )
}

export default EditModal
