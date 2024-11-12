import type { HttpContext } from '@adonisjs/core/http'
import type { ApiResponse } from '#types'

export class ResponseService {
  public created<T>(response: HttpContext['response'], message: string, data: T) {
    const apiResponse: ApiResponse<T> = {
      status: 'success',
      message,
      data,
    }
    return response.status(201).send(apiResponse)
  }

  public success<T>(response: HttpContext['response'], message: string, data?: T) {
    const apiResponse: ApiResponse<T> = {
      status: 'success',
      message,
      data,
    }
    return response.status(200).send(apiResponse)
  }

  public error(response: HttpContext['response'], message: string, statusCode = 400) {
    const apiResponse: ApiResponse<null> = {
      status: 'error',
      message,
    }
    return response.status(statusCode).send(apiResponse)
  }
}
