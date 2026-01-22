import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class VideoLike extends BaseModel {

  static table = "video_likes"

  @column({ isPrimary: true })
  declare videoLikeId: number

  @column()
  declare mobileVideoId?: number | null

  @column()
  declare userId?: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
