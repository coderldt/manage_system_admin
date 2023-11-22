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
  [key: number]: string | number
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

// formConfig
export interface FormConfigProps {
  saveFormConfig: (SearchForm) => void
}