import { ApiResponse } from '#types'
import type User from '#models/user'

export interface RegistrationUser {
  fullName: string
  email: string
  password
  // ...
}

export interface RegistrationResponseData {
  status: 'success'
  message: string
  data: Pick<InstanceType<typeof User>, 'id' | 'email' | 'fullName' | 'createdAt'>
}

// Complete login response type using ApiResponse
export type RegistrationResponse = ApiResponse<RegistrationResponseData>
