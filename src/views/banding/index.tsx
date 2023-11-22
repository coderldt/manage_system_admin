import { useState } from 'react'
import { Button, Form, Input, Radio, Space, Steps, Table, message } from 'antd'
import UploadFile from './uploadFile.tsx'
import FormConfig from './formConfig.tsx'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd/es/upload'
import { INLINE_FORM_ITEM_WIDTH } from '@/config'
import PositioningModal, { type PositionMpdalProps } from './positioningModal'
import { findSepadTogeSexIndex, readXlsx, writeXlsx } from './tool'
import { SearchForm, StudentData, StudentColunm, SaveTableData } from './type.d'
import './index.less'

const steps = [
  {
    title: '上传文件',
    description: '文件上传并预览',
  },
  {
    title: '配置',
    description: '设置分班配置',
  },
  {
    title: '结果',
    description: '结果微调',
  },
]

const Home = () => {
  const [current, setCurrent] = useState(0)

  const [tableData, setTableData] = useState<StudentColunm[]>([])
  const [columns, setColumns] = useState<StudentData[]>([])

  const saveTableData: SaveTableData = (xlsxColumns, xlsxData) => {
    setColumns(xlsxColumns)
    setTableData(xlsxData)
  }

  const [formConfig, setFormConfig] = useState<SearchForm>()
  const saveFormConfig = (form: SearchForm) => {
    setFormConfig(form)
  }

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  return (
    <>
      <div className="banding-class">
        <Steps className='step' current={current} items={steps} />
        <div className='content' >
          {
            current === 0 && <UploadFile
              xlsxColumns={columns}
              xlsxData={tableData}
              saveTableData={saveTableData}
            />
          }
          {
            current === 1 && <FormConfig
              saveFormConfig={saveFormConfig}
            />
          }
        </div>
        <div className='control'>
          <Space>
            {current > 0 && (
              <Button onClick={() => prev()}>
                上一步
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                下一步
              </Button>
            )}
          </Space>
        </div>
      </div>
    </>
  )
}

export default Home
