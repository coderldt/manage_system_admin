import type { Dayjs } from "dayjs"
import type { MenuType, Status } from '@/enum'

export interface SearchType {
  callStatus?: string
  errorStatus?: string
  planDate?: string[]
  createTime?: string[] | [Dayjs, Dayjs]
  regionManager?: string[]
  callResaon?: string[]
  name?: string
}

export interface Columns {
  menu_id: string
  menu_name: string
  menu_icon: string
  menu_type: `${MenuType}`
  sort: number
  parent_id: string
  status: `${Status}`
}

export interface PermissionForm {
  menu_id: number
  menu_type: keyof typeof MenuType
  parent_id?: number | string
  sort: number
}

export enum ModalType {
  add = '新增',
  edit = '编辑',
  detail = '详情',
  addSub = '新增子类'
}
