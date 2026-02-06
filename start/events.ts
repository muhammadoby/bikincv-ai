import CreatePayment from '#events/create_payment'
import emitter from '@adonisjs/core/services/emitter'

const SendPaymentNotification = () => import('#listeners/send_payment_notification')


emitter.on(CreatePayment, [SendPaymentNotification])
