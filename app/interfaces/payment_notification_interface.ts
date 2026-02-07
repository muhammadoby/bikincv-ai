import User from "#models/user";

export default interface paymentNotificationInterface{
    orderId: string,
    user: User,
    totalPaid: number,
    paymentLink: string,
    expiredTime: string
}