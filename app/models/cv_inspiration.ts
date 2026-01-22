import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CvInspiration extends BaseModel {

  static table = "cv_inspiration"

  @column({ isPrimary: true })
  declare cvInspId: number

  @column()
  declare section: string

  @column()
  declare field: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
