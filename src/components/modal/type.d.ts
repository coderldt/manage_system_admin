import React from 'react'

export interface ModalProps {
  visible: boolean
  title: React.ReactNode
  content: React.ReactNode
  onOk?: () => void
  onCancel?: () => void
}