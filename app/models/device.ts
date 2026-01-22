import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Device extends BaseModel {

  static table = "devices"

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare platform: string

  @column()
  declare token: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
