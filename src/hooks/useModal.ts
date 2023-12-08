import { useState } from 'react'
import { ModalProps } from '@/components/modal/type'

interface Props {
  props: {
    title: React.ReactNode
    content: React.ReactNode
  }
  onOk: () => void
  onCancel: () => void
}

interface Result {
  openModal: () => void
  closeModal: () => void
  setModalProp: (data: object) => void
}

type UseModalType = (props: Props) => ([ModalProps, Result])

const useModal: UseModalType = ({ props, onOk, onCancel }) => {
  const [modalVisible, setModalVisible] = useState(false)

  const openModal = () => {
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const setModalProp = (data: any) => {
    onOk()
    onCancel()
  }

  return [
    {
      visible: modalVisible,
      ...props,
      onOk: onOk,
      onCancel: onCancel,
    },
    {
      openModal,
      closeModal,
      setModalProp
    }
  ]
}

export default useModal