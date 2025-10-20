export interface SuccessResponse<T = {}> {
  status: true
  message: string
  data: T
  meta: any // for now, until pagination comes
}

export interface ErrorResponse<T = {}> {
  status: false
  message: string
  errors?: Record<keyof T, string[]>
}
