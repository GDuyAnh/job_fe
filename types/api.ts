export interface ApiResponse<T = any> {
  data: T
  statusCode: StatusCode
  errors: any
}

export interface ListResponse<T = any> {
  items: T[]
  total: number
  page: number
  limit: number
}
