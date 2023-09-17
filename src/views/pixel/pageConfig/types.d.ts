import type { Status } from '@/enum'
import type { NiticeType } from '@/enum/pixel'

export interface SearchType {
  notice_type?: `${NiticeType}`
}

export interface Columns {
  page_id: string
  page_title: string
  page_router: string
  page_logo: string
  status: `${Status}`
}

export interface PageConfigForm {
  page_id: string,
  page_title: string,
  page_router: string,
  page_logo: string,
  status: `${Status}`
}

export enum ModalType {
  add = '新增',
  edit = '编辑',
  detail = '详情',
}
