import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ComDiscussion extends BaseModel {

  static table = "com_discussion"

  @column({ isPrimary: true })
  declare comDisId: string

  @column()
  declare userId: number

  @column()
  declare comDisTopicId: number

  @column()
  declare title: string

  @column()
  declare slug?: string |null

  @column()
  declare body?: string | null

  @column()
  declare featImg?: string | null

  @column()
  declare featImgUrl?: string | null

  @column()
  declare isEdited: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
