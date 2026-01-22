import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MobPopup extends BaseModel {

  static table = "mob_popup"

  @column({ isPrimary: true })
  declare mobPopupId: number

  @column()
  declare imageName: string

  @column()
  declare imagePath?: string | null

  @column()
  declare url: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
