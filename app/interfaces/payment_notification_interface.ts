import User from "#models/user";

export default interface paymentNotificationInterface{
    orderId: string,
    user: User,
    totalPaid: number,
    reviewId: number,
    paymentLink: string,
    expiredTime: string
}
