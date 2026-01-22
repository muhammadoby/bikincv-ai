import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MobileVideo extends BaseModel {

  static table = "mobile_video"

  @column({ isPrimary: true })
  declare mobileVideoId: number

  @column()
  declare title: string

  @column()
  declare desc: string

  @column()
  declare slug: string

  @column()
  declare views: number

  @column()
  declare videoUrl: string

  @column()
  declare videoThumbUrl: string

  @column()
  declare videoHastags: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
