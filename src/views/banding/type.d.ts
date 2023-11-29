export interface SearchForm {
  brandCount: number
  isDisruption: 1 | 2
  sexBalance: 1 | 2
}

export interface StudentData {
  id: number
  key: number
  title: string
  dataIndex: number
}

export interface StudentColunm {
  // id: number
  [key: number | string]: string | number
}

export interface XlexColumn {
  key: number
  title: string
  dataIndex: number
  id: number
}

// uploadFile
export type SaveTableData = (xlsxColumns: StudentData[], xlsxData: StudentColunm[]) => void
export interface UploadFileProps {
  xlsxColumns: StudentData[]
  xlsxData: StudentColunm[]
  saveTableData: SaveTableData
}
export interface TableConfig {
  separateIndex: number
  togetherIndex: number
  sexIndex: number
  nameIndex: number
}

// formConfig
export interface FormConfigProps {
  saveFormConfig: (SearchForm) => void
}

// ResultAdjust
export interface ResultAdjustProps {
  tableConfig: TableConfig
  result: StudentColunm[][]
}

export interface MoveModalProps {
  currentClass: number
  targetClass: number
  otherClass: number[]
  student: StudentColunm
  tableConfig: TableConfig
  students: StudentColunm[]
}