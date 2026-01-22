import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AppVersion extends BaseModel {

  static table = "app_version"

  @column({ isPrimary: true })
  declare app_version_id: number

  @column()
  declare iosAppVersion: string

  @column()
  declare androidAppVersion: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
