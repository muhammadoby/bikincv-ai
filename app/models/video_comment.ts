import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class VideoComment extends BaseModel {

  static table = "video_comments"

  @column({ isPrimary: true })
  declare videoCommentId: number

  @column()
  declare mobileVideoId?: number | null

  @column()
  declare userId?: number | null

  @column()
  declare replyTo?: number | null

  @column()
  declare comment: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
