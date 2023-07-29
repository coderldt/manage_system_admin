import { useState } from "react"
import { Button, Form, Input, InputNumber, Modal, Radio, TreeSelect, message } from "antd"
import IconfontSelect from '@/components/iconfontSelect'
import { Code, MenuType, Status } from "@/enum"
import ajax from "@/tools/axios"
import request from '@/request'
import { ModalType, type Columns, type PermissionForm } from './types.d'

interface Props {
  mode: keyof typeof ModalType
  data?: Columns
  list: Columns[]
  refrensh: (initPage: boolean) => void
}

const EditModal: React.FC<Props> = ({ mode, data, list, refrensh }) => {
  const [show, setShow] = useState(false)
  const [isMenu, setIsMenu] = useState(true)
  const [form] = Form.useForm<PermissionForm>()

  const showModal = () => {
    setShow(true)
    form.resetFields()
    if (mode === 'add' || mode === 'addSub') {
      form.setFieldValue('parent_id', data?.menu_id)
    } else if (mode === 'detail' || mode === 'edit') {
      getDetail()
    }
  }

  const getDetail = async () => {
    const res = await ajax.post<PermissionForm>(request.sys.permission.detail, { menu_id: data?.menu_id })
    if (res.code === Code.SUCCESS) {
      form.setFieldsValue(res.data)
    }
  }

  const handleSave = () => {
    form.validateFields()
      .then(async values => {
        let res = null
        if (mode === 'add' || mode === 'addSub') {
          res = await ajax.post(request.sys.permission.add, values)
        } else if (mode === 'edit') {
          res = await ajax.post(request.sys.permission.update, { ...values, menu_id: data?.menu_id })
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
          <Form.Item name="menu_name" label="权限名称" rules={[{ required: true, message: '权限名称不能为空' }]}>
            <Input placeholder='请输入' disabled={mode === 'detail'} ></Input>
          </Form.Item>
          <Form.Item name="menu_type" initialValue={MenuType.MENU} label="权限类型" rules={[{ required: true, message: '权限类型不能为空' }]}>
            <Radio.Group disabled={mode === 'detail'} onChange={(e) => setIsMenu(e.target.value === MenuType.MENU)}>
              <Radio value={MenuType.MENU}>菜单</Radio>
              <Radio value={MenuType.OPERATE}>操作</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="path" label="路径" rules={[{ required: isMenu, message: '权限类型不能为空' }]}>
            <Input placeholder='请输入' disabled={mode === 'detail'} ></Input>
          </Form.Item>
          <Form.Item name="menu_icon" initialValue='' label="icon" rules={[{ required: false, message: 'icon不能为空' }]}>
            <IconfontSelect disabled={mode === 'detail'} />
          </Form.Item>
          <Form.Item name="parent_id" label="父级" rules={[{ required: false, message: '请输入电话' }]}>
            <TreeSelect
              showSearch
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              treeData={list}
              fieldNames={{ label: 'menu_name', value: 'menu_id', children: 'children' }}
              disabled={mode === 'detail'}
            />
          </Form.Item>
          <Form.Item name="sort" label="排序" initialValue={1} rules={[{ required: true, message: '排序不能为空' }]}>
            <InputNumber style={{ width: '100%' }} disabled={mode === 'detail'} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={Status.ENABLE} rules={[{ required: true, message: '状态不能为空' }]}>
            <Radio.Group disabled={mode === 'detail'}>
              <Radio value={Status.ENABLE}>展示</Radio>
              <Radio value={Status.DISABLE}>隐藏</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditModal
