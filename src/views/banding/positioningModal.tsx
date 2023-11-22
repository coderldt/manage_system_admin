import React, { useState } from 'react'
import { Button, Modal } from 'antd'

export interface PositionMpdalProps {
  show: boolean
  close: () => void
  data: any
}

const App: React.FC<PositionMpdalProps> = ({ show, close, data }) => {
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('Content of the modal')


  const handleOk = () => {
    setModalText('The modal will be closed after two seconds')
    setConfirmLoading(true)
    setTimeout(() => {
      setConfirmLoading(false)
    }, 2000)
  }

  return (
    <>
      <Modal
        title="Title"
        width={'90vw'}
        open={show}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={close}
      >

        <p>{modalText}</p>
      </Modal>
    </>
  )
}

export default App