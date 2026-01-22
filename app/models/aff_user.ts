import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AffUser extends BaseModel {

  static table = "aff_users"

  @column({ isPrimary: true })
  declare affUserId: number

  @column()
  declare userId: number

  @column()
  declare affiliateCode: string

  @column()
  declare cities?: string | null

  @column()
  declare socialMedia?: string | null

  @column()
  declare bankDetails?: string | null

  @column()
  declare whereKnowAffiliate?: string | null

  @column()
  declare commissionPercentage: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
