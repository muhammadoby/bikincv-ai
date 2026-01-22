import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AffTransaction extends BaseModel {

  static table = "aff_transaction"

  @column({ isPrimary: true })
  declare affTransId: number

  @column()
  declare affUserId: number

  @column()
  declare affSaleId?: number | null

  @column()
  declare affWithdrawId?: number | null

  @column()
  declare typeTrans: string

  @column()
  declare moneyIn: number

  @column()
  declare moneyOut: number

  @column()
  declare currentBalance: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
