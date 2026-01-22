import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserPoStatistic extends BaseModel {

  static table = "user_po_statistics"

  @column({ isPrimary: true })
  declare userPoStId: number

  @column()
  declare userId: number

  @column()
  declare userIdVisitor?: number | null

  @column()
  declare ip: string

  @column()
  declare isView?: boolean | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
