import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AffSale extends BaseModel {

  static table = "aff_sales"

  @column({ isPrimary: true })
  declare affSaleId: number

  @column()
  declare affUserId: number

  @column()
  declare orderId: number

  @column()
  declare totalComission: number

  @column()
  declare comissionStatus: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
