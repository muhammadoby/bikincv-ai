import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserActivity extends BaseModel {

  static table = "user_activities"

  @column({ isPrimary: true })
  declare userActvId: number

  @column()
  declare userId: number

  @column()
  declare ip: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
