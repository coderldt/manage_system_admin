import type { Status } from '@/enum'

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
  page?: number | null;
  pageSize?: number | null;
  total?: number | null;
  list: T[]
}
