// index
export interface TableConfig {
  separateIndex: number
  togetherIndex: number
  sexIndex: number
  nameIndex: number
}

// uploadFile
export interface XlsxColumn {
  id: number
  key: number
  title: string
  dataIndex: number
}

export interface XlsxData {
  [key: number]: string | number
  student_id: string
  together_color?: string
}

export type SaveTableData = (xlsxColumns: XlsxColumn[], xlsxData: XlsxData[]) => void
export interface UploadFileProps {
  xlsxColumns: XlsxColumn[]
  xlsxData: XlsxData[]
  saveTableData: SaveTableData
}

// searchForm
export interface SearchForm {
  brandCount: number
  isDisruption: 1 | 2
  sexBalance: 1 | 2
}

// resultAdjust
export interface ResultAdjustProps {
  tableConfig: TableConfig
  exportColumns: XlsxColumn[]
  result: XlsxData[][]
}

export interface SortableClassProps {
  students: XlsxData[]
  tableConfig: TableConfig
  index: number
}