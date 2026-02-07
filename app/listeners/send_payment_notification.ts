import logger from "@adonisjs/core/services/logger"
import paymentNotificationInterface from "../interfaces/payment_notification_interface.js"
import mail from "@adonisjs/mail/services/main"
import StringHelpers from "../helpers/string_helpers.js"

type eventPayload = {
    payload: paymentNotificationInterface
} | paymentNotificationInterface

export default class SendPaymentNotification {
    async handle(eventPayload: eventPayload) {
        const data = 'payload' in eventPayload ? eventPayload.payload : eventPayload

        // send email notification
        try {
            await mail.send(mailer => {
                mailer.to(data.user.email)
                    .subject('Selesaikan Pembayaran')
                    .from('no-reply@bikincv.com')
                    .htmlView('mail/payment_email', {
                        user: data.user,
                        orderNumber: data.orderId,
                        paymentLink: data.paymentLink,
                        expiredTime: data.expiredTime,
                        totalPaid: StringHelpers.formatCurrency(data.totalPaid)
                    })
            })

            logger.info('Payment notification sent successfully')
        } catch (error) {
            logger.error('Error sending payment notification:', error)
        }
    }
}