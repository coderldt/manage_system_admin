import { MenuType } from "@/enum"

export interface User {
	user_id?: string
	username?: string
	password?: string
	phone?: string
	created_user?: string
	created_time?: string
	updated_user?: string
	updated_time?: string
}

export interface Permission {
	menu_id: string
	menu_name: string
	menu_icon: string
	menu_type: `${MenuType}`
	path: string
	parent_id?: string | null
	sort: number
	created_user?: string
	created_time: string
	updated_user?: string
	updated_time: string
}

export interface Info {
	user: User
	permission: Permission[]
}

export interface InfoStoreState {
	info: Info
	rePasswordShow: boolean
}