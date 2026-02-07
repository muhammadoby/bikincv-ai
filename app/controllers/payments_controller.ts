import type { HttpContext } from '@adonisjs/core/http'
import BaseMessage from '../utils/base_message.js'
import { MidtransService } from '#services/midtrans_service'
import logger from '@adonisjs/core/services/logger'

export default class PaymentsController {
  /**
   * @handle
   * @summary Method to handle incoming payment callback
   * @description
   */
  async handle({ request, response, params }: HttpContext) {
    const { payment_method } = params
    const {
      order_id,
      status_code,
      transaction_status,
      gross_amount,
      signature_key,
      payment_type
    } = request.all()

    try {

      // check the payment method
      switch (payment_method) {
        case "midtrans":
          await MidtransService.handle({
            order_id,
            transaction_status,
            status_code,
            gross_amount,
            signature_key,
            payment_type,
            gateway_response: request.all()
          })
          break;

        case "xendit":

          break;

        default:
          return response.status(400).send(BaseMessage(false, "Invalid payment method"))
      }

      return response.send(BaseMessage(true, "Payment callback handled successfully"))

    } catch (error: any) {
      return response.status(error.status || 500).send(BaseMessage(false, error.message))
    }
  }
}
