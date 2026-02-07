import CreatePayment from '#events/create_payment'
import PaymentSuccess from '#events/payment_success'
import emitter from '@adonisjs/core/services/emitter'

const SendPaymentNotification = () => import('#listeners/send_payment_notification')
const SendSuccessPaymentNotification = () => import('#listeners/send_success_payment_notification')

emitter.on(CreatePayment, [SendPaymentNotification])
emitter.on(PaymentSuccess, [SendSuccessPaymentNotification])