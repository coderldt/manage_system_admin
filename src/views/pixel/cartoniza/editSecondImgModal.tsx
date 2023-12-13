import { useState } from "react"
import { Button, Form, Modal, Space, Upload, message } from "antd"
import { Code, Status } from "@/enum"
import ajax from "@/tools/axios"
import request from '@/request'
import type { Columns, Detail } from './types'

interface Props {
  data?: Columns
  refrensh: (initPage: boolean) => void
}

const EditSecondImgModal: React.FC<Props> = ({ data, refrensh }) => {
  const [show, setShow] = useState(false)
  const [detail, setDetail] = useState<Columns>({
    typeId: '',
    label: '',
    value: '',
    parentId: '',
    sort: 1,
    isRecommend: '1',
    status: Status.ENABLE,
    imgUrl: ''
  })
  const [parentDetail, setparentDetail] = useState<Columns>({
    typeId: '',
    label: '',
    value: '',
    parentId: '',
    sort: 1,
    isRecommend: '1',
    status: Status.ENABLE,
    imgUrl: ''
  })

  const showModal = () => {
    setShow(true)
    getDetail()
  }

  const getDetail = async () => {
    const res = await ajax.post<Detail, { typeId: React.Key | undefined }>(request.pixel.cartoniza.detail, { typeId: data?.typeId })
    if (res.code === Code.SUCCESS) {
      const { detail, parentDetail } = res.data
      if (!parentDetail?.imgUrl) {
        message.warning('图片类型的原图还未上传，请先上传后，再来同步样式效果图吧')
      }
      setDetail(detail)
      parentDetail && setparentDetail(parentDetail)
    }
  }

  const handleSave = async () => {
    if (!detail.imgUrl) {
      return message.error(`请先上传图片`)
    }

    const res = await ajax.post(request.pixel.cartoniza.uploadCartonizaImg, { typeId: detail.typeId, url: detail.imgUrl })

    if (res && res.code === Code.SUCCESS) {
      message.success(`图片上传成功`)
      refrensh(false)
      setShow(false)
    } else {
      message.error(res && res.msg)
    }
  }

  const layout = {
    labelCol: { span: 4 },
  }


  const [status, setStatus] = useState(false)
  const [code, setCode] = useState('')
  const asyncChildImg = () => {
    if (status) {
      return message.warning(`图片正在同步中，请尝试获取结果图（异步）`)
    }

    ajax.post(request.pixel.cartoniza.asyncChildImg, { typeId: detail.typeId }).then(res => {
      if (res && res.code === Code.SUCCESS) {
        setCode(res.data as string)
        message.success(`转换成功，请通过异步任务获取结果`)
      } else {
        message.error(res && res.msg)
      }
    })
  }
  const getAsyncImgResult = () => {
    ajax.post(request.pixel.cartoniza.getAsyncImgResult, { code }).then(res => {
      if (res && res.code === Code.SUCCESS) {
        message.success(`图片转换成功`)
        setCode('')
        setDetail((prevData) => ({
          ...prevData,
          imgUrl: res.data as string
        }))
        setStatus(false)
      } else {
        message.error('异步任务还未跑完，请稍后再试')
      }
    })
  }


  const handleCancel = () => {
    setShow(false)
  }

  return (
    <>
      <Button onClick={showModal} type={'primary'}>效果图同步</Button>
      <Modal
        title={detail.label + ' 效果图同步'}
        open={show}
        width={'700px'}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Form
          {...layout}
          name="control-hooks"
        >
          <Form.Item name="label" label="图片类型">
            { parentDetail.label }
          </Form.Item>
          <Form.Item label="图片原图">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              disabled={true}
            >
              <img src={parentDetail.imgUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Upload>
          </Form.Item>
          <Form.Item name="label" label="样式分类名称">
            { detail.label }
          </Form.Item>
          <Form.Item label="样式效果图">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
            >
              <img src={detail.imgUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Upload>
          </Form.Item>
          <Form.Item label="同步图片">
            <Space>
              <Button type='primary' onClick={asyncChildImg}>图片同步(异步)</Button>
              <Button type='primary' onClick={getAsyncImgResult}>获取结果</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditSecondImgModal
