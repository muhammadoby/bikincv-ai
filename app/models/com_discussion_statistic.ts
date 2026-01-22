import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ComDiscussionStatistic extends BaseModel {

  static table = "com_discussion_statistic"

  @column({ isPrimary: true })
  declare comDisStatId: string

  @column()
  declare userId?: number | null

  @column()
  declare comDisId?: string | null

  @column()
  declare comDisReplyId?: string | null

  @column()
  declare ip: string

  @column()
  declare isView?: boolean | null

  @column()
  declare isLike?: boolean | null

  @column()
  declare isDislike?: boolean | null

  @column()
  declare isBookmark?: boolean | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
