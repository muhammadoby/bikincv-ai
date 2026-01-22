import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Page extends BaseModel {

  static table = "pages"

  @column({ isPrimary: true })
  declare pageId: number

  @column()
  declare langCode: string

  @column()
  declare permalink?: string | null

  @column()
  declare pageName: string

  @column()
  declare slug: string

  @column()
  declare jsonData: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
