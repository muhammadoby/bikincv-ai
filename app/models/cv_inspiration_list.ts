import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CvInspirationList extends BaseModel {

  static table = "cv_inspiration_lists"

  @column({ isPrimary: true })
  declare cvInspListId: number

  @column()
  declare cvInspId: number

  @column()
  declare jobTitle: string

  @column()
  declare keywords: string

  @column()
  declare contents: string

  @column()
  declare language: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
