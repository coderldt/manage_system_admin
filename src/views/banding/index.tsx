import { useState } from 'react'
import { Button, Space, Steps, message } from 'antd'
import UploadFile from './uploadFile.tsx'
import FormConfig from './formConfig.tsx'
import ResultAdjust from './resultAdjust.tsx'
import { findSepadTogeSexIndex } from './tool'
import { SearchForm, StudentData, StudentColunm, SaveTableData, TableConfig } from './type.d'
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

  const [tableData, setTableData] = useState<StudentColunm[]>([])
  const [columns, setColumns] = useState<StudentData[]>([])
  const [tableConfig, setTableConfig] = useState<TableConfig>({
    separateIndex: 0,
    togetherIndex: 0,
    sexIndex: 0,
    nameIndex: 0,
  })

  const saveTableData: SaveTableData = (xlsxColumns, xlsxData) => {
    console.log('🚀 ~ file: index.tsx:38 ~ Home ~ xlsxData:', xlsxData)
    setColumns(xlsxColumns)
    setTableData(xlsxData)
  }

  const [formConfig, setFormConfig] = useState<SearchForm>()
  const saveFormConfig = (form: SearchForm) => {
    setFormConfig(form)
  }

  const [result, setResult] = useState<StudentColunm[][]>([])
  const brand = () => {
    console.log('tableData', tableData)

    if (!tableData.length) {
      return message.error('数据来源不能为空')
    }
    if (!formConfig?.brandCount) {
      return message.error('分班配置不能为空')
    }

    setResult([])

    const res = [] as StudentColunm[][]
    for (let index = 1; index <= formConfig.brandCount; index++) {
      res.push([])
    }

    const targetDataSource = JSON.parse(JSON.stringify(tableData)) as StudentColunm[]
    const { separateIndex, togetherIndex, sexIndex, nameIndex } = findSepadTogeSexIndex(columns)
    setTableConfig({ separateIndex, togetherIndex, sexIndex, nameIndex })
    console.log('🚀 ~ file: index.tsx:57 ~ brand ~ separateIndex, togetherIndex, sexIndex:', separateIndex, togetherIndex, sexIndex, nameIndex)

    // 需要特殊处理的学生
    const specStudents = targetDataSource.filter(i => i[separateIndex] || i[togetherIndex])
    // 在一起的学生
    const togetherStduentsObj: { [key: number | string]: StudentColunm[] } = {}
    // 不在一起的学生
    const separateStduentsObj: { [key: number | string]: StudentColunm[] } = {}
    // let maxTogetherStduents = 0
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

    let maxSeparateStduents = 0

    Object.entries(separateStduentsObj).forEach(([key, value]) => {
      console.log(`不在一班的：${key} - ${value.map(i => i[1])}`)
      if (maxSeparateStduents < value.length) {
        maxSeparateStduents = value.length
      }
    })
    let maxTogetherStduents = 0

    Object.entries(togetherStduentsObj).forEach(([key, value]) => {
      console.log(`在一班的：${key} - ${value.map(i => i[1])}`)
      if (maxTogetherStduents < value.length) {
        maxTogetherStduents = value.length
      }
    })

    if (maxSeparateStduents > formConfig.brandCount) {
      return message.error(`当前有${maxSeparateStduents}个学生不要在一个班，但是最大班级个数为${formConfig.brandCount}`)
    }

    Object.values(togetherStduentsObj).forEach((value, index) => {
      res[index].push(...value)
    })

    Object.values(separateStduentsObj).forEach((value, index) => {
      value.forEach((val, idx) => {
        res[res.length - idx - 1].push(val)
      })
    })

    // 获取剩下的学生
    let randomStudents = targetDataSource.filter(i => !i[separateIndex] && !i[togetherIndex])

    const avgStudents = Math.ceil(targetDataSource.length / formConfig.brandCount)

    // 是否打乱
    if (formConfig.isDisruption === 1) {
      randomStudents = randomStudents.sort((a, b) => Math.random() > 0.5 ? 1 : -1)
      console.log("🚀 ~ 打乱列表:", randomStudents.map(i => i[2]))
    } else {
      console.log("🚀 ~ 不打乱列表:", randomStudents.map(i => i[2]))
    }

    const manList: StudentColunm[] = []
    const womanList: StudentColunm[] = []
    if (formConfig.sexBalance === 1) {
      randomStudents.forEach(i => {
        if (i[sexIndex] === '男') {
          manList.push(i)
        } else {
          womanList.push(i)
        }
      })

      randomStudents = [...manList, ...womanList]
      console.log("🚀 ~ 男女均衡:", randomStudents.map(i => `${i[2]}-${i[3]}`))
    } else {
      console.log("🚀 ~ 男女不均衡:", randomStudents.map(i => `${i[2]}-${i[3]}`))
    }

    // 均衡则计算男生占比，不均衡则去 number 最大值
    const targetManSource = targetDataSource.filter(i => i[sexIndex] === '男')
    const targetWomanSource = targetDataSource.filter(i => i[sexIndex] === '女')
    const sexMaxRate = formConfig.sexBalance === 1 ? targetManSource.length / targetDataSource.length : Number.MAX_VALUE
    const sexWomaxRate = formConfig.sexBalance === 1 ? targetWomanSource.length / targetDataSource.length : Number.MAX_VALUE
    console.log("🚀 ~ 男性最大占比:", targetManSource.length, targetDataSource.length, sexMaxRate)

    let index = 0
    randomStudents.forEach((s) => {
      if (index < res.length) {
        let currentManLength = res[index].filter(i => i[sexIndex] === '男').length
        let currentWomanLength = res[index].filter(i => i[sexIndex] === '女').length
        while (res[index].length >= avgStudents || (formConfig.sexBalance === 1 && (s[sexIndex] === '男' ? currentManLength : currentWomanLength) / avgStudents >= (s[sexIndex] === '男' ? sexMaxRate : sexWomaxRate))) {
          index += 1
          if (index === res.length) {
            index = 0
          }
          currentManLength = res[index].filter(i => i[sexIndex] === '男').length
          currentWomanLength = res[index].filter(i => i[sexIndex] === '女').length
        }
        res[index].push(s)
        index += 1

        if (index === res.length) {
          index = 0
        }
      }
    })

    console.log(res)
    setResult(res)

    // Object.values(res).forEach((val, index) => {
    //   console.log(`第${index}班`)
    //   console.log(`总人数${val.length}`)
    //   console.log(`人名${val.map(i => `${i[2]}-${i[3]}`)}`)
    //   console.log(`男生人数${val.filter(i => i[sexIndex] === '男').length}`)
    //   console.log(`女生人数${val.filter(i => i[sexIndex] === '女').length}`)
    // })
  }

  const next = () => {
    console.log(current, typeof current)

    switch (current) {
      case 0:
        if (!columns.length || !tableData.length) {
          return message.error('上传文件数据不能为空。')
        }
        setCurrent(current + 1)
        break

      case 1:
        if (!formConfig?.brandCount) {
          return message.error('分班配置项不能为空，请点击确认按钮。')
        }
        brand()
        setCurrent(current + 1)
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
              saveFormConfig={saveFormConfig}
            />
          </div>
          {
            current === 2 && <div
              className="result-adjust"
            >
              <ResultAdjust
                tableConfig={tableConfig}
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
