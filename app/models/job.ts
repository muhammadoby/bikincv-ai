import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Job extends BaseModel {

  static table = "jobs"

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare queue: string

  @column()
  declare payload: string

  @column()
  declare attempts: boolean

  @column()
  declare reservedAt: number

  @column()
  declare availableAt: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
