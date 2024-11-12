import type { HttpContext } from '@adonisjs/core/http'
import type { ApiResponse } from '#types'

export class ResponseService {
  public success<T>(
    response: HttpContext['response'],
    message: string,
    data?: T,
    statusCode = 200
  ) {
    const apiResponse: ApiResponse<T> = {
      status: 'success',
      message,
      data,
    }
    return response.status(statusCode).send(apiResponse)
  }

  public error(response: HttpContext['response'], message: string, statusCode = 400) {
    const apiResponse: ApiResponse<null> = {
      status: 'error',
      message,
    }
    return response.status(statusCode).send(apiResponse)
  }
}
