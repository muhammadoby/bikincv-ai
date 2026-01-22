import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Package extends BaseModel {

  static table = "package"

  @column({ isPrimary: true })
  declare pkgId: number

  @column()
  declare pkgName: string

  @column()
  declare pkgSlug: string

  @column()
  declare discount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
