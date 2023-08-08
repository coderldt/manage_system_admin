import { useState } from 'react'
import { Button, Form, Input, Radio, Space, Table, Upload, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { UploadOutlined } from '@ant-design/icons'
import * as XLSX from 'xlsx'
import './index.less'
import { INLINE_FORM_ITEM_WIDTH } from '@/config'
import { SearchForm, StudentData, StudentColunm } from './type.d'
const Home = () => {
  const [fileList, setFileList] = useState([])
  const [tableData, setTableData] = useState<StudentColunm[]>([])
  const [columns, setColumns] = useState<StudentData[]>([])

  const handleChange = info => {
    const parsedData: StudentColunm[] = []

    const reader = new FileReader()

    reader.onload = event => {
      const content = event.target.result
      const workbook = XLSX.read(content, { type: 'binary' })

      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 }) as string[][]

      const columns: StudentData[] = []
      sheetData[0].forEach((header, index) => {
        columns.push({ key: index, title: header, dataIndex: index, id: index })
      })
      setColumns(columns)

      sheetData.slice(1).forEach((row, idx) => {
        const obj: StudentColunm = { 'id': idx }
        row.forEach((row, index) => {
          obj[index] = row
        })

        if (Object.keys(obj).length > 1) {
          parsedData.push(obj)
        }
      })

      setTableData(parsedData)
    }

    reader.readAsBinaryString(info.file)
  }

  const [form] = Form.useForm<SearchForm>()
  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  }

  const tailLayout = {
    wrapperCol: { offset: 12, span: 16 },
  }

  const onFinish = (values: SearchForm) => {
    brand(values)
    // props.handleSearch(values)
  }

  const onReset = () => {
    form.resetFields()
    // props.handleReset({})
  }


  const [result, setResult] = useState([])
  const brand = (values: SearchForm) => {
    if (!tableData.length) {
      return message.error('数据来源不能为空')
    }

    setResult([])

    const res = [] as StudentColunm[][]
    for (let index = 0; index < values.brandCount; index++) {
      res.push([])
    }

    const targetDataSource = JSON.parse(JSON.stringify(tableData)) as StudentColunm[]
    const separateIndex = columns.findIndex(colunm => colunm.title.includes('separate-class'))
    const togetherIndex = columns.findIndex(colunm => colunm.title.includes('together-class'))


    const specStudents = targetDataSource.filter(i => i[separateIndex] || i[togetherIndex])
    const togetherStduentsObj: { [key: number | string]: StudentColunm[] } = {}
    const separateStduentsObj: { [key: number | string]: StudentColunm[] } = {}
    specStudents.forEach(i => {
      if (i[togetherIndex]) {
        if (!togetherStduentsObj[i[togetherIndex]]) {
          togetherStduentsObj[i[togetherIndex]] = []
        }
        togetherStduentsObj[i[togetherIndex]].push(i)
      } else if (i[separateIndex]) {
        if (!separateStduentsObj[i[separateIndex]]) {
          separateStduentsObj[i[separateIndex]] = []
        }
        separateStduentsObj[i[separateIndex]].push(i)
      }
    })

    Object.values(togetherStduentsObj).forEach((value, index) => {
      res[index].push(...value)
    })

    Object.values(separateStduentsObj).forEach((value, index) => {
      value.forEach((val, idx) => {
        res[res.length - idx - 1].push(val)
      })
    })

    console.log("🚀 ~ file: index.tsx:79 ~ brand ~ res:", res, res.length)

  }

  return (
    <>
      <div className="home">
        <Upload
          onChange={handleChange}
          beforeUpload={() => false} // 取消默认自动上传
        >
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
        >
          <Form.Item name="brandCount" initialValue={'1'} label="班级数量" rules={[{ required: true }]}>
            <Input placeholder='请输入输入班级数量' style={{ width: `${INLINE_FORM_ITEM_WIDTH}px` }}></Input>
          </Form.Item>
          <Form.Item name="isDisruption" initialValue={1} label="是否打乱" rules={[{ required: true }]}>
            <Radio.Group >
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Space>
              <Button type="primary" htmlType="submit">
                分班
              </Button>
              <Button htmlType="button" onClick={onReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
        <h3>数据源</h3>
        <Table columns={columns} scroll={{ y: 500 }} dataSource={tableData} pagination={false} rowKey="key" />
        <h3>分班结果</h3>

      </div>
    </>
  )
}

export default Home
