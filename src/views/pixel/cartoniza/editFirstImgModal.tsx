import { useState } from "react"
import { Button, Form, Modal, Upload, message } from "antd"
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload'
import { Code, Status } from "@/enum"
import ajax from "@/tools/axios"
import request from '@/request'
import type { Columns, Detail } from './types'
import apiUrl from '@/request'

interface Props {
  data?: Columns
  refrensh: (initPage: boolean) => void
}

const EditFirstImgModal: React.FC<Props> = ({ data, refrensh }) => {
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

  const showModal = () => {
    setShow(true)
    getDetail()
  }

  const getDetail = async () => {
    const res = await ajax.post<Detail, { typeId: React.Key | undefined }>(request.pixel.cartoniza.detail, { typeId: data?.typeId })
    if (res.code === Code.SUCCESS) {
      const { detail } = res.data
      setDetail(detail)
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


  const handleCancel = () => {
    setShow(false)
  }

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Image must smaller than 5MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'done') {
      const { code, data } = info.file.response
      if (code === Code.SUCCESS) {
        setDetail((prevData) => ({
          ...prevData,
          imgUrl: data
        }))
      } else {
        setDetail((prevData) => ({
          ...prevData,
          imgUrl: ''
        }))
      }
    }
  };

  const uploadButton = (
    <div>
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  return (
    <>
      <Button onClick={showModal} type={'primary'}>图片编辑</Button>
      <Modal
        title={detail.label + '图片上传'}
        open={show}
        onOk={handleSave}
        onCancel={handleCancel}
      >
        <Form
          {...layout}
          name="control-hooks"
        >
          <Form.Item name="label" label="图片类型">
            { detail.label }
          </Form.Item>
          <Form.Item label="上传图片" rules={[{ required: true, message: '图片不能为空!' }]}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={apiUrl.imgUpload.upload}
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {detail.imgUrl ? <img src={detail.imgUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default EditFirstImgModal
