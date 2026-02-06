import { BaseEvent } from '@adonisjs/core/events'
import paymentNotificationInterface from '../interfaces/payment_notification_interface.js'

export default class CreatePayment extends BaseEvent {
  /**
   * Accept event data as constructor parameters
   */
  constructor(public payload: paymentNotificationInterface) {
    super()
  }
}