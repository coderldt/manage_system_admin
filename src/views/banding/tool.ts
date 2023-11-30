import * as XLSX from 'xlsx'
import { XlsxColumn, XlsxData, SearchForm, TableConfig } from './type'

type ReadXlsx = (file: File) => Promise<{ xlsxColumns: XlsxColumn[], xlsxData: XlsxData[] }>

export const readXlsx: ReadXlsx = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = event => {
      const xlsxColumns: XlsxColumn[] = []
      const xlsxData: XlsxData[] = []

      const content = event.target?.result
      if (content) {
        const workbook = XLSX.read(content, { type: 'binary' })

        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 }) as string[][]

        sheetData[0].forEach((header, index) => {
          xlsxColumns.push({ key: index, title: header, dataIndex: index, id: index })
        })

        sheetData.slice(1).forEach((row, idx) => {
          const obj: XlsxData = { student_id: `student_${idx}` }
          row.forEach((row, index) => {
            obj[index] = row
          })

          if (Object.keys(obj).length > 1) {
            xlsxData.push(obj)
          }
        })
      }

      console.log('xlsxColumns', xlsxColumns)
      console.log('xlsxData', xlsxData)

      resolve({
        xlsxColumns,
        xlsxData
      })
    }

    reader.readAsBinaryString(file)
  })
}

export const writeXlsx = ({ xlsxColumns, xlsxData }: { xlsxColumns: XlsxColumn[], xlsxData: XlsxData[][] }) => {
  const workbook = XLSX.utils.book_new()

  Object.entries(xlsxData).forEach(([key, value]) => {
    const exportData: { [key: string]: string }[] = []
    value.forEach(data => {
      const obj: { [key: string]: string } = {}
      xlsxColumns.forEach(k => {
        obj[k.title] = String(data[k.dataIndex] || ' ')
      })
      exportData.push(obj)
    })
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    XLSX.utils.book_append_sheet(workbook, worksheet, `1.${Number(key) + 1}`)
  })

  const today = new Date()
  const filename = "data_" + today.getFullYear() + (today.getMonth() + 1) + today.getDate() + ".xlsx"

  XLSX.writeFile(workbook, filename)
}

export const findSepadTogeSexIndex: (columns: XlsxColumn[]) => TableConfig = (columns) => {
  const separateIndex = columns.findIndex(colunm => colunm.title.includes('separate-class'))
  const togetherIndex = columns.findIndex(colunm => colunm.title.includes('together-class'))
  const sexIndex = columns.findIndex(colunm => colunm.title.includes('性别'))
  const nameIndex = columns.findIndex(colunm => colunm.title.includes('姓名'))

  return {
    separateIndex,
    togetherIndex,
    sexIndex,
    nameIndex,
  }
}

type BrandClass = (
  tableData: XlsxData[],
  tableColumns: XlsxColumn[],
  formConfig: SearchForm,
) => Promise<{ status: 'success' | 'error', data: {tableConfig: TableConfig, result: XlsxData[][]}, msg: string }>

export const brandClass: BrandClass = (tableData, tableColumns, formConfig) => {
  return new Promise((resolve, reject) => {
    console.log('起始数据源', tableData)
    if (!tableData.length) {
      reject({ status: 'error', msg: '学生数据不能为空'})
    }
    if (!formConfig?.brandCount) {
      reject({ status: 'error', msg: '分班配置不能为空'})
    }

    const res = [] as XlsxData[][]
    for (let index = 1; index <= formConfig.brandCount; index++) {
      res.push([])
    }

    let tableConfig: TableConfig = {
      separateIndex: 0,
      togetherIndex: 0,
      sexIndex: 0,
      nameIndex: 0,
    }

    const targetDataSource = JSON.parse(JSON.stringify(tableData)) as XlsxData[]
    tableConfig = findSepadTogeSexIndex(tableColumns)
    const { separateIndex, togetherIndex, sexIndex, nameIndex } = tableConfig
    console.log('🚀 ~ separateIndex, togetherIndex, sexIndex, nameIndex:', separateIndex, togetherIndex, sexIndex, nameIndex)

    // 需要特殊处理的学生
    const specStudents = targetDataSource.filter(i => i[separateIndex] || i[togetherIndex])
    console.log('🚀 ~ 需要特殊处理的学生:', specStudents)
    // 在一起的学生
    const togetherStduentsObj: { [key: number | string]: XlsxData[] } = {}
    // 不在一起的学生
    const separateStduentsObj: { [key: number | string]: XlsxData[] } = {}
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
      reject({ status: 'error', msg: `当前有${maxSeparateStduents}个学生不要在一个班，但是最大班级个数为${formConfig.brandCount}`})
    }

    Object.values(togetherStduentsObj).forEach((value, index) => {
      res[index].push(...value)
    })

    Object.values(separateStduentsObj).forEach((value) => {
      value.forEach((val, idx) => {
        res[res.length - idx - 1].push(val)
      })
    })

    // 获取剩下的学生
    let randomStudents = targetDataSource.filter(i => !i[separateIndex] && !i[togetherIndex])

    const avgStudents = Math.ceil(targetDataSource.length / formConfig.brandCount)

    // 是否打乱
    if (formConfig.isDisruption === 1) {
      randomStudents = randomStudents.sort(() => Math.random() > 0.5 ? 1 : -1)
      console.log("🚀 ~ 打乱列表:", randomStudents.map(i => i[2]))
    } else {
      console.log("🚀 ~ 不打乱列表:", randomStudents.map(i => i[2]))
    }

    const manList: XlsxData[] = []
    const womanList: XlsxData[] = []
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

    console.log('分班最终结果', res)
    resolve({ status: 'success', data: { result: res, tableConfig }, msg: ''})
  })
}