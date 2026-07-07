import type { HttpContext } from '@adonisjs/core/http'
import BaseMessage from '../utils/base_message.js'
import { MidtransService } from '#services/midtrans_service'
import { checkVoucherSchema } from '#validators/payment_validator'
import Promo from '#models/promo'
import { DateTime } from 'luxon'

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

  /**
   * @checkVoucher
   * @summary Method to check voucher
   * @description Method to check voucher
   * @requestBody <checkVoucherSchema> - Voucher code
   */
  async checkVoucher({ response, request }: HttpContext) {
    const payload = await request.validateUsing(checkVoucherSchema)
    try {
      const today = DateTime.now().toISODate()

      const result = await Promo.query()
        .where('code', payload.promo_code)
        .where('is_active', true)
        .where('start_date', '<=', today)
        .where('end_date', '>=', today)
        .first()

      // check if voucher is valid
      if (!result) {
        return response.status(404).send(BaseMessage(false, "Voucher invalid!"))
      }

      return response.status(200).send(BaseMessage(true, "Voucher found", result))
    } catch (error: any) {
      return response.status(error.status || 500).send(BaseMessage(false, error.message || 'Something went wrong', error))
    }
  }
}
