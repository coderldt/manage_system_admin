export interface SearchType {
  role_name?: string
}

export interface Columns {
  role_id: React.Key;
  role_name: string;
  created_time: string
  children: Columns[]
}
