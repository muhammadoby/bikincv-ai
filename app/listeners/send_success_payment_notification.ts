import logger from "@adonisjs/core/services/logger"
import paymentSuccessNotificationInterface from "../interfaces/payment_success_notification_interface.js"
import mail from "@adonisjs/mail/services/main"

type eventPayload = {
    payload: paymentSuccessNotificationInterface
} | paymentSuccessNotificationInterface

export default class SendSuccessPaymentNotification {
    async handle(eventPayload: eventPayload) {
        const data = 'payload' in eventPayload ? eventPayload.payload : eventPayload

        // send email notification
        try {
            await mail.send(mailer => {
                mailer.to(data.user.email)
                    .subject('Pembayaran Berhasil')
                    .from('no-reply@bikincv.com')
                    .htmlView('mail/payment_success', {
                        user: data.user,
                        orderNumber: data.orderNumber
                    })
            })

            logger.info('Payment notification sent successfully')

        } catch (error) {
            logger.error(error)
        }
    }
}
