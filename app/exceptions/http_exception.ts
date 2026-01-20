import { Exception } from '@adonisjs/core/exceptions'

export default class HttpException extends Exception {
  static status = 500
  constructor(message: string, status: number = 500) {
    super(message, { status: status })
  }
}
