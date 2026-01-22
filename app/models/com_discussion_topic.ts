import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ComDiscussionTopic extends BaseModel {

  static table = "com_discussion_topic"

  @column({ isPrimary: true })
  declare comDisTopicId: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @column()
  declare thisOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
