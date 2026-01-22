import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MobSlideshowHome extends BaseModel {

  static table = "mob_slideshow_home"

  @column({ isPrimary: true })
  declare mobSlideshowHomeId: number

  @column()
  declare imageName: string

  @column()
  declare link?: string | null

  @column()
  declare thisOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
