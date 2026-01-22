import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class VideoHashtag extends BaseModel {

  static table = "video_hashtags"

  @column({ isPrimary: true })
  declare videoHashtagId: number

  @column()
  declare hashtag: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
