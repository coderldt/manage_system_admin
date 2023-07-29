import { useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import type { ButtonProps } from 'antd'
import { createFromIconfontCN } from '@ant-design/icons'
import { iconfontList, iconfontScriptUrl } from '@/config/iconfont'
import './index.less'

enum Mode {
  single = 'single',
  multiple = 'multiple'
}

const Iconfont = createFromIconfontCN({
  scriptUrl: iconfontScriptUrl,
})

interface Props {
  btnProps?: ButtonProps
  btnTitle?: string
  mode?: `${Mode}`
  disabled?: boolean
  defaultSelectValue?: string
  handleClick?: (params: string) => void
  // 兼容 ant form 表单校验，不需要传入参数
  value?: string
  onChange?: (value: string | undefined) => void
}


const IconfontSelect: React.FC<Props> = ({ btnProps, btnTitle = '选择图标', mode = Mode.single, disabled, value, defaultSelectValue, handleClick, onChange }) => {
  const [show, setShow] = useState(false)
  const [selectVals, setSelectVals] = useState<string[]>([])

  const showModal = () => {
    setShow(true)
  }

  const handleSelect = (iconfont: string) => {
    let finalValue = []
    if (mode === Mode.single) {
      finalValue = [iconfont]
      setSelectVals(finalValue)
    } else {
      if (selectVals.includes(iconfont)) {
        finalValue = selectVals.filter(icon => icon !== iconfont)
        setSelectVals(finalValue)
      } else {
        finalValue = [...selectVals, iconfont]
        setSelectVals(finalValue)
      }
    }
    onChange?.(finalValue.join(','))
  }

  const handleOk = () => {
    handleClick && handleClick(selectVals.join(','))
    setShow(false)
  }

  useEffect(() => {
    value && setSelectVals(value.split(',').filter(i => i))
  }, [value])

  useEffect(() => {
    if (defaultSelectValue) {
      setSelectVals(defaultSelectValue.split(',').filter(i => i))
      handleSelect(defaultSelectValue)
    }
  }, [defaultSelectValue])

  return (
    <>
      <div className="iconfont-select-control">
        {
          !disabled && <Button {...btnProps} onClick={showModal} key='button'  >
            {btnTitle}
          </Button>
        }
        {
          selectVals.map(iconfont => (
            <div
              key={`1${iconfont}`}
              className={`iconfont-item`}
            >
              <Iconfont type={iconfont} ></Iconfont>
            </div>
          ))
        }
      </div>
      <Modal
        title='图标选择'
        width={768}
        open={show}
        onOk={handleOk}
        key='modal'
        onCancel={() => setShow(false)}
      >
        <div className="iconfont-container">
          {
            iconfontList.map(iconfont => (
              <div
                key={`2${iconfont}`}
                className={`iconfont-item ${selectVals.includes(iconfont) ? 'iconfont-item-select' : ''}`}
                onClick={() => handleSelect(iconfont)}
              >
                <Iconfont type={iconfont}></Iconfont>
              </div>
            ))
          }
        </div>
      </Modal>
    </>
  )
}

export default IconfontSelect