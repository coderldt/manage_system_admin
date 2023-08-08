export interface SearchForm {
  brandCount: number
  isDisruption: 1 | 2
}

export interface StudentData {
  id: number
  key: number
  title: string
  dataIndex: number
}

export interface StudentColunm {
  id: number
  [key: number]: string | number
}