import type { Dayjs } from "dayjs"

export interface SearchType {
  callStatus?: string
  errorStatus?: string
  planDate?: string[]
  createTime?: string[] | [Dayjs, Dayjs]
  regionManager?: string[]
  callResaon?: string[]
  name?: string
}

