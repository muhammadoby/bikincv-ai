import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ConfirmPayment extends BaseModel {

  static table = "confirm_payments"

  @column({ isPrimary: true })
  declare confirmPayId: number

  @column()
  declare orderId: number

  @column()
  declare orderNumber: string

  @column()
  declare dateTransfer: Date

  @column()
  declare amountTransfer: number

  @column()
  declare senderName: string

  @column()
  declare bankName: string

  @column()
  declare transferProof: string

  @column()
  declare status: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
