import midtransClient from 'midtrans-client'
import env from '#start/env'
import User from '#models/user'
import logger from '@adonisjs/core/services/logger'
import HttpException from '#exceptions/http_exception'
import AiPayment from '#models/ai_payment'
import db from '@adonisjs/lucid/services/db'
import PaymentSuccess from '#events/payment_success'

export class MidtransService {

  // define snap instance
  private static snap = new midtransClient.Snap({
    isProduction: env.get('MIDTRANS_IS_PRODUCTION') === 'true',
    serverKey: env.get('MIDTRANS_SERVER_KEY', ''),
    clientKey: env.get('MIDTRANS_CLIENT_KEY', ''),
  })

  // method to create order id
  static createOrderId() {
    const randOrderId = Math.floor(Math.random() * 1000000)
    const orderId = `${randOrderId}${Date.now().toString().slice(0, 4)}`
    return orderId
  }

  // method to create transaction
  static async createTransaction(orderId: string, amount: number, customer: User) {
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: customer.name,
        last_name: '',
        email: customer.email,
        phone: customer.phone,
      },
    }

    return await this.snap.createTransaction(parameter)
  }

  // method to verify signature transaction
  static async verifySignature(orderId: string, statusCode: string, grossAmount: string, signatureKey: string) {
    const crypto = await import('crypto')
    const serverKey = env.get('MIDTRANS_SERVER_KEY')
    const checkSignature = crypto.createHash('sha512')
      .update(orderId + statusCode + grossAmount + serverKey)
      .digest('hex')

    return checkSignature === signatureKey
  }

  // method to handle incoming payment callback
  static async handle(payload: {
    order_id: string,
    transaction_status: string,
    status_code: string,
    gross_amount: string,
    signature_key: string,
    payment_type?: string | null,
    gateway_response?: object | null
  }) {
    const trx = await db.transaction();
    try {
      const isValid = await MidtransService.verifySignature(payload.order_id, payload.status_code, payload.gross_amount, payload.signature_key);

      // check if signature is valid
      if (!isValid) throw new HttpException('Invalid signature', 400);

      // check fraud status
      // if (fraud_status != 'accept') return response.status(400).send(BaseMessage(false, "Payment rejected"));

      // check if request from midtrans test url
      if (payload.order_id.startsWith('payment_notif_test')) return {
        status: 200,
        message: "Callback processed"
      }

      // select transaction by order id
      const transaction = (await AiPayment.query().where('order_id', payload.order_id).firstOrFail()).useTransaction(trx);

      transaction.load('aiCvAnalyzer', (query) => {
        query.preload('user')
      })

      // check payment status
      switch (payload.transaction_status) {
        case 'settlement':
          transaction.status = 'paid';
          break;

        case 'pending':
          transaction.status = 'pending';
          break;

        case 'expire':
          transaction.status = 'expired';
          break;

        default:
          transaction.status = 'failed';
          break;
      }

      transaction.gatewayResponse = payload.gateway_response;
      transaction.channel = payload.payment_type ? payload.payment_type : null;

      (await transaction.save()).useTransaction(trx);

      logger.info("Payment callback processed");

      await trx.commit();

      const aiCvAnalyzer = await transaction.related('aiCvAnalyzer').query().select('order_number').firstOrFail()

      // send email notification when payment is success
      if (payload.transaction_status === 'settlement') {
        // send email notification
        PaymentSuccess.dispatch({
          orderNumber: aiCvAnalyzer.orderNumber.toString(),
          user: transaction.aiCvAnalyzer.user
        })
      }

      return {
        status: 200,
        message: "Callback processed"
      }
    } catch (error: any) {
      logger.error(error);
      await trx.rollback();
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
