import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PopupBanner extends BaseModel {

  static table = "popup_banners"

  @column({ isPrimary: true })
  declare bannerId: number

  @column()
  declare imageUrl: string

  @column()
  declare isPublished: boolean

  @column()
  declare link: string

  @column()
  declare iosCount: number

  @column()
  declare androidCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
