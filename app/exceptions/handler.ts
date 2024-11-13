import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { inject } from '@adonisjs/core'
import { MESSAGES } from '../types/messages.js'
import { ResponseService } from '#services/response_service'

@inject()
export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  constructor(protected responseService: ResponseService) {
    super()
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const routePattern = ctx.route?.pattern || 'unknown route'
    const requestMethod = ctx.request.method()

    // Log error with route information
    // console.error(`Error in ${requestMethod} ${routePattern}:`, error)

    if (error instanceof errors.E_VALIDATION_ERROR) {
      return this.responseService.error(ctx.response, 'Validation failed', 422, error.messages)
    }

    if (error.code! === 'E_UNAUTHORIZED_ACCESS') {
      return this.responseService.error(ctx.response, MESSAGES.USER_UNAUTHORIZED, 401)
    }

    if (error.code === 'E_ROW_NOT_FOUND') {
      return this.responseService.error(ctx.response, MESSAGES.ROW_NOT_FOUND, 404)
    }

    if (error.code === 'E_INVALID_CREDENTIALS') {
      return this.responseService.error(ctx.response, MESSAGES.USER_INVALID_CREDENTIALS, 401)
    }

    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
