import { BaseEvent } from '@adonisjs/core/events'
import paymentSuccessNotificationInterface from '../interfaces/payment_success_notification_interface.js'

export default class PaymentSuccess extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(public payload: paymentSuccessNotificationInterface) {
    super()
  }
}