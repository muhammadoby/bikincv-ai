import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class VideoBookmark extends BaseModel {

  static table = "video_bookmarks"

  @column({ isPrimary: true })
  declare videoBookmarkId: number

  @column()
  declare mobileVideoId?: number | null

  @column()
  declare userId?: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
