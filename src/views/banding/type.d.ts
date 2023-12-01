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

export interface MoveModalProps {
  currentClass: number // 当前学生所在班级
  targetClass: number // 跳转目标班级
  otherClass: number[] // 其他班级数
  student: XlsxData // 移动当前学生
  tableConfig: TableConfig // 学生信息index
  students: (XlsxData & { isMove: '1' | '0' })[] // 所在一起班级学生
}

export interface SortableClassProps {
  students: XlsxData[]
  tableConfig: TableConfig
}