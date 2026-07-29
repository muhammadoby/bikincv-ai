import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as CoreError } from "@adonisjs/core"
import { errors as ValidationError } from "@vinejs/vine"
import { errors as authErrors } from '@adonisjs/auth'
import { errors as limiterErrors } from '@adonisjs/limiter'
import { errors as driveErrors } from '@adonisjs/drive'
import BaseMessage from '../utils/base_message.js'
import logger from '@adonisjs/core/services/logger'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof CoreError.E_ROUTE_NOT_FOUND) return ctx.response.status(404).send(BaseMessage(false, "Route not found"))
    if (error instanceof ValidationError.E_VALIDATION_ERROR) return ctx.response.status(400).send(BaseMessage(false, "Validation error", error.messages))
    if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) return ctx.response.status(401).send(BaseMessage(false, "Unauthorized Access"))
    if (error instanceof authErrors.E_INVALID_CREDENTIALS) return ctx.response.status(401).send(BaseMessage(false, "Invalid Credentials"))
    if (error instanceof limiterErrors.E_TOO_MANY_REQUESTS) return ctx.response.status(429).send(BaseMessage(false, "Too many requests"))
    if (error instanceof driveErrors.CannotServeFileException) return ctx.response.status(404).send(BaseMessage(false, "File not found"))

    logger.error(error instanceof Error ? error.stack || error.message : String(error))

    if (this.debug) {
      logger.error(error instanceof Error ? error.stack || error.message : String(error))
      return ctx.response.status(500).send(BaseMessage(false, error instanceof Error ? error.stack || error.message : String(error)))
      // return super.handle(error, ctx)
    }

    return ctx.response.status(500).send(BaseMessage(false, error instanceof Error ? error.message : String(error)))
    // return super.handle(error, ctx)
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
