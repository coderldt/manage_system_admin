import type { Dayjs } from "dayjs"
import type {Status} from '@/enum'

export interface SearchType {
  namename?: string
  phone?: string
}

export interface UserForm {
  user_id?: number | string
  username: string
  phone: string
  role_ids: string[]
}

export interface UserDetail {
	user_id: string;
	username: string;
	password: string;
	phone: string;
	status: string;
	created_user?: string;
	created_time?: string;
	updated_user: string;
	updated_time: string;
	role_ids: string;
}

export interface Columns {
  user_id: React.Key;
  namename: string;
  password: string;
  status: `${Status}`
  phone: string;
}
