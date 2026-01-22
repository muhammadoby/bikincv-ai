import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ComDiscussionReply extends BaseModel {

  static table = "com_discussion_reply"

  @column({ isPrimary: true })
  declare comDisReplyId: string

  @column()
  declare comDisId: string

  @column()
  declare userIdSender: number

  @column()
  declare baseReply?: string | null

  @column()
  declare inReply?: string | null

  @column()
  declare body?: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
