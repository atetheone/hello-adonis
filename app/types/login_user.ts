// app/types/login_user.ts
import type { ApiResponse } from '#types/response'
import type User from '#models/user'

// Input type for login request
export interface LoginCredentials {
  email: string
  password: string
}

// Type for the token response
export interface TokenResponse {
  type: string
  token: string
  expiresAt: string | null
  lastUsedAt: string | null
}

// Type for successful login response data
export interface LoginResponseData {
  user: Pick<InstanceType<typeof User>, 'id' | 'email' | 'fullName'>
  token: TokenResponse
}

// Complete login response type using ApiResponse
export type LoginResponse = ApiResponse<LoginResponseData>
