import React, { useState } from 'react'
import { Modal } from 'antd'
import { ModalProps } from './type.d'

const CustomModal: React.FC<ModalProps> = ({ visible, title, content, onOk, onCancel }) => {
  const [modalVisible, setModalVisible] = useState(visible)


  const handleOk = () => {
    setModalVisible(false)
    if (onOk) {
      onOk()
    }
  }

  const handleCancel = () => {
    setModalVisible(false)
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <Modal
      title={title}
      open={modalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>{content}</p>
    </Modal>
  )
}

export default CustomModal