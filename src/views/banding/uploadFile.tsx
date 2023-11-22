import React, { useState } from 'react'
import { Button, Table, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd/es/upload'
import { findSepadTogeSexIndex, readXlsx } from './tool'
import { SearchForm, StudentData, StudentColunm, UploadFileProps } from './type.d'

const UploadFile: React.FC<UploadFileProps> = ({
  xlsxColumns,
  xlsxData,
  saveTableData
}) => {
  const handleChange: UploadProps['onChange'] = async (e) => {
    const { xlsxColumns, xlsxData } = await readXlsx(e.file)

    saveTableData(xlsxColumns, xlsxData)
  }

  const [result, setResult] = useState([])
  const brand = (values: SearchForm) => {
    if (!tableData.length) {
      return message.error('数据来源不能为空')
    }

    setResult([])

    const res = [] as StudentColunm[][]
    for (let index = 1; index <= values.brandCount; index++) {
      res.push([])
    }

    const targetDataSource = JSON.parse(JSON.stringify(tableData)) as StudentColunm[]
    const { separateIndex, togetherIndex, sexIndex } = findSepadTogeSexIndex(columns)
    console.log('🚀 ~ file: index.tsx:57 ~ brand ~ separateIndex, togetherIndex, sexIndex:', separateIndex, togetherIndex, sexIndex)

    console.log(`学生总数${targetDataSource.length}`)

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

    if (maxSeparateStduents > values.brandCount) {
      return message.error(`当前有${maxSeparateStduents}个学生不要在一个班，但是最大班级个数为${values.brandCount}`)
    }

    Object.values(togetherStduentsObj).forEach((value, index) => {
      res[index].push(...value)
    })

    Object.values(separateStduentsObj).forEach((value, index) => {
      value.forEach((val, idx) => {
        res[res.length - idx - 1].push(val)
      })
    })

    console.log(res, 'res')

    // 获取剩下的学生
    let randomStudents = targetDataSource.filter(i => !i[separateIndex] && !i[togetherIndex])
    console.log("🚀 ~ 获取剩下的学生:", randomStudents)

    const avgStudents = Math.ceil(targetDataSource.length / values.brandCount)

    // 是否打乱
    if (values.isDisruption === 1) {
      randomStudents = randomStudents.sort((a, b) => Math.random() > 0.5 ? 1 : -1)
      console.log("🚀 ~ 打乱列表:", randomStudents.map(i => i[2]))
    } else {
      console.log("🚀 ~ 不打乱列表:", randomStudents.map(i => i[2]))
    }

    const manList: StudentColunm[] = []
    const womanList: StudentColunm[] = []
    if (values.sexBalance === 1) {
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
    const sexMaxRate = values.sexBalance === 1 ? targetManSource.length / targetDataSource.length : Number.MAX_VALUE
    const sexWomaxRate = values.sexBalance === 1 ? targetWomanSource.length / targetDataSource.length : Number.MAX_VALUE
    console.log("🚀 ~ 男性最大占比:", targetManSource.length, targetDataSource.length, sexMaxRate)

    let index = 0
    randomStudents.forEach((s) => {
      if (index < res.length) {
        let currentManLength = res[index].filter(i => i[sexIndex] === '男').length
        let currentWomanLength = res[index].filter(i => i[sexIndex] === '女').length
        while (res[index].length >= avgStudents || (values.sexBalance === 1 && (s[sexIndex] === '男' ? currentManLength : currentWomanLength) / avgStudents >= (s[sexIndex] === '男' ? sexMaxRate : sexWomaxRate))) {
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

    // Object.values(res).forEach((val, index) => {
    //   console.log(`第${index}班`)
    //   console.log(`总人数${val.length}`)
    //   console.log(`人名${val.map(i => `${i[2]}-${i[3]}`)}`)
    //   console.log(`男生人数${val.filter(i => i[sexIndex] === '男').length}`)
    //   console.log(`女生人数${val.filter(i => i[sexIndex] === '女').length}`)
    // })
  }

  return (
    <>
      <div className="first-upload">
        <Upload
          showUploadList={false}
          onChange={handleChange}
          beforeUpload={() => false} // 取消默认自动上传
        >
          <Button icon={<UploadOutlined />}>选择文件</Button>
        </Upload>
        <h3 className='title'>数据预览</h3>
        {
          xlsxData.length && <Table
            bordered
            columns={xlsxColumns}
            scroll={{ y: 450 }}
            dataSource={xlsxData}
            pagination={false}
            rowKey="id"
          />
        }
      </div>
    </>
  )
}

export default UploadFile
