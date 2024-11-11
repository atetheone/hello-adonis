export interface ApiResponse<T> {
  status: 'success' | 'error'
  message?: string
  data?: T
  errors?: Array<{ message: string }>
}
