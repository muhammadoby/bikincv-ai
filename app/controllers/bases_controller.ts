import type { HttpContext } from '@adonisjs/core/http'
import BaseMessage from '../utils/base_message.js'

export default class BasesController {
  /**
   * @ping
   * @summary Method to handle ping
   * @description Method to handle ping
   */
  async ping({ response }: HttpContext) {
    try {
      return response.status(200).send(BaseMessage(true, 'pong'))
    } catch (error) {
      return response.status(error.status || 500).send(BaseMessage(false, error.message))
    }
  }
}
