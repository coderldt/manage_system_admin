import { useRef, useState } from 'react'
import { Button, Space, Steps, message } from 'antd'
import UploadFile from './components/uploadFile.tsx'
import FormConfig from './components/formConfig.tsx'
import ResultAdjust from './components/resultAdjust.tsx'
import { brandClass } from './tool'
import { SearchForm, SaveTableData, TableConfig, XlsxData, XlsxColumn } from './type.d'
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
    description: '结果调整',
  },
]

const Home = () => {
  const [current, setCurrent] = useState(0)

  const [tableData, setTableData] = useState<XlsxData[]>([])
  const [columns, setColumns] = useState<XlsxColumn[]>([])
  const [tableConfig, setTableConfig] = useState<TableConfig>({
    separateIndex: 0,
    togetherIndex: 0,
    sexIndex: 0,
    nameIndex: 0,
  })

  const formConfigRef = useRef(null)

  const saveTableData: SaveTableData = (xlsxColumns, xlsxData) => {
    setColumns(xlsxColumns)
    setTableData(xlsxData)
  }

  const [formConfig, setFormConfig] = useState<SearchForm>()

  const [result, setResult] = useState<XlsxData[][]>([])

  const next = () => {
    switch (current) {
      case 0:
        if (!columns.length || !tableData.length) {
          return message.error('请先上传学生文件')
        }
        setCurrent(current + 1)
        break

      case 1:
        brandClass(tableData, columns, (formConfigRef.current.getFieldsValue() as SearchForm)).then(
          res => {
            setTableConfig(res.data.tableConfig)
            setResult(res.data.result)

            setCurrent(current + 1)
          },
          (err) => {
            if (err.status === 'error') {
              message.error(err.msg)
            }
          }
        )
        break
      case 2:
        break
    }
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  return (
    <>
      <div className="banding-class">
        <Steps className='step' current={current} items={steps} />
        <div className='content' >
          <div
            className="upload-file"
            style={{ display: current === 0 ? 'block' : 'none' }}
          >
            <UploadFile
              xlsxColumns={columns}
              xlsxData={tableData}
              saveTableData={saveTableData}
            />
          </div>
          <div
            className="form-config"
            style={{ display: current === 1 ? 'block' : 'none' }}
          >
            <FormConfig
              ref={formConfigRef}
            />
          </div>
          {
            current === 2 && <div
            >
              <ResultAdjust
                tableConfig={tableConfig}
                exportColumns={columns}
                result={result}
              />
            </div>
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
