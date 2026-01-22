import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PaymentGateway extends BaseModel {

  static table = "payment_gateway"

  @column({ isPrimary: true })
  declare paymentGatewayId: number

  @column()
  declare orderId?: number | null

  @column()
  declare cvReviewOrderId?: number | null

  @column()
  declare name: string

  @column()
  declare tokenId: string

  @column()
  declare paidAmount: number

  @column()
  declare paymentChannel?: string | null

  @column.dateTime()
  declare expired_at?: DateTime | null

  @column()
  declare status: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
