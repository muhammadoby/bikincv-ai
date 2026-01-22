import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MobPushNotif extends BaseModel {

  static table = "mob_push_notif"

  @column({ isPrimary: true })
  declare mobPushNotifId: number

  @column()
  declare title: string

  @column()
  declare desc: string

  @column()
  declare url: string

  @column()
  declare imageUrl: string

  @column()
  declare sent?: boolean | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
