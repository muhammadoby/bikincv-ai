import type { HttpContext } from '@adonisjs/core/http'
import BaseMessage from '../utils/base_message.js'

export default class PaymentsController {
  /**
   * @handle
   * @summary Method to handle incoming payment callback
   * @description
   */
  async handle({ request, response, params }: HttpContext) {
    const { payment_method } = params
    const payload = request.all()

    try {

      // check the payment method
      switch (payment_method) {
        case "midtrans":

          break;

        case "xendit":

          break;

        default:
          return response.status(400).send(BaseMessage(false, "Invalid payment method"))
          break;
      }


    } catch (error) {
      return response.status(error.status || 500).send(BaseMessage(false, error.message))
    }
  }
}
