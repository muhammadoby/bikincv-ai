import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AffWithdraw extends BaseModel {

  static table = "aff_withdraw"

  @column({ isPrimary: true })
  declare affWithdrawId: number

  @column()
  declare affUserId: number

  @column()
  declare reference: string

  @column()
  declare totalWithdraw: number

  @column()
  declare withdrawStatus: number

  @column()
  declare verified: boolean

  @column()
  declare verifiedCode?: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
