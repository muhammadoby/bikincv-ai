import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ApcLetDetail extends BaseModel {

  static table = "apc_let_details"

  @column({ isPrimary: true })
  declare apx_let_detail_id: number

  @column()
  declare orderId: number

  @column()
  declare orderNumber: string

  @column()
  declare location: string

  @column()
  declare date: Date

  @column()
  declare dear: string

  @column()
  declare companyName: string

  @column()
  declare companyLocation: string

  @column()
  declare companyAddress: string

  @column()
  declare jobAs: string

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
