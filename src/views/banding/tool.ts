import * as XLSX from 'xlsx'

export const readXlsx = (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = event => {
      const xlsxColumns = []
      const xlsxData = []

      const content = event.target.result
      const workbook = XLSX.read(content, { type: 'binary' })

      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 }) as string[][]

      sheetData[0].forEach((header, index) => {
        xlsxColumns.push({ key: index, title: header, dataIndex: index, id: index })
      })

      sheetData.slice(1).forEach((row, idx) => {
        const obj: { [key: string | number]: any } = { 'id': idx }
        row.forEach((row, index) => {
          obj[index] = row
        })

        if (Object.keys(obj).length > 1) {
          xlsxData.push(obj)
        }
      })
      resolve({
        xlsxColumns,
        xlsxData
      })
    }

    reader.readAsBinaryString(file)
  })
}

export const writeXlsx = ({ xlsxColumns, xlsxData }) => {
  const workbook = XLSX.utils.book_new();

  Object.entries(xlsxData).forEach(([key, value]) => {
    const exportData = []
    value.forEach(data => {
      const obj = {}
      Object.entries(data).forEach(([key, value], index) => {
        const col = xlsxColumns.find(i => i.dataIndex == key)
        if (col) {
          obj[col.title] = String(value)
        }
      })

      exportData.push(obj)
    })
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    XLSX.utils.book_append_sheet(workbook, worksheet, `1.${Number(key) + 1}`);
  })

  const today = new Date();
  const filename = "data_" + today.getFullYear() + (today.getMonth() + 1) + today.getDate() + ".xlsx";

  XLSX.writeFile(workbook, filename);
}

export const findSepadTogeSexIndex = (columns) => {
  const separateIndex = columns.findIndex(colunm => colunm.title.includes('separate-class'))
  const togetherIndex = columns.findIndex(colunm => colunm.title.includes('together-class'))
  const sexIndex = columns.findIndex(colunm => colunm.title.includes('性别'))

  return {
    separateIndex,
    togetherIndex,
    sexIndex
  }
}