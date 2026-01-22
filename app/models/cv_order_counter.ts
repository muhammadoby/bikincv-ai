import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CvOrderCounter extends BaseModel {

  static table = "cv_order_counter"

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare count: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
