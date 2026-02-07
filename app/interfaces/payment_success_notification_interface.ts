import User from "#models/user"

export default interface paymentSuccessNotificationInterface {
    user: User
    orderNumber: string
}