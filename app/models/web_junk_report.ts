import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class WebJunkReport extends BaseModel {

  static table = "web_junk_reports"

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare report: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
