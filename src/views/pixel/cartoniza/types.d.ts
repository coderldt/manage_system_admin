import type {Status} from '@/enum'

export interface SearchType {
  parentId: string
}

export interface UserForm {
  typeId?: string
  label: string
  value: string
  parentId: string
  sort: number
  isRecommend: '1' | '2'
  status: `${Status}`
}

export interface Columns {
  typeId: React.Key
  parentId: React.Key
  label: string
  value: string
  imgUrl: string
  isRecommend: '1' | '2'
  sort: number
  status: `${Status}`
  children?: Columns[]
}

// detail 接口
export interface Detail {
  detail: Columns,
  parentDetail?: Columns
}

export interface FirstUploadForm {
  typeId: string
  url: string
}