import type { Status } from '@/enum'
import { type } from 'os'

export interface Pages {
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface Columns {
  user_id: React.Key;
  namename: string;
  password: string;
  status: `${Status}`;
  phone: string;
}

export interface CommonTableListRes<T> {
  page?: number;
  pageSize?: number;
  total?: number;
  list: T[]
}

export type CommonTableAfterResuest<T> = (params: CommonTableListRes<T>) => { data: T[], pages: Pages }