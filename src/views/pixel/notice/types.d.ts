import type { Status } from '@/enum'
import type { NiticeType } from '@/enum/pixel'

export interface SearchType {
  notice_type?: `${NiticeType}`
}

export interface Columns {
  notice_id: string
  notice_title: string
  notice_type: `${NiticeType}`
  status: `${Status}`
}

export interface NoticeForm {
  notice_id: string,
  notice_title: string,
  notice_type: `${NiticeType}`,
  status: `${Status}`
}

export enum ModalType {
  add = '新增',
  edit = '编辑',
  detail = '详情',
}
