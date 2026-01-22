import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AffBalance extends BaseModel {
  static table = "aff_balance"

  @column({ isPrimary: true })
  declare affBalanceId: number

  @column()
  declare affUserId: number

  @column()
  declare balance: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
