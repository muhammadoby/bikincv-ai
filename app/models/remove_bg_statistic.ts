import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RemoveBgStatistic extends BaseModel {

  static table = "remove_bg_statistic"

  @column({ isPrimary: true })
  declare remBgStId: number

  @column()
  declare userId?: number | null

  @column()
  declare ip: string

  @column()
  declare isDownload?: boolean | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
