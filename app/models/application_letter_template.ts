import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ApplicationLetterTemplate extends BaseModel {

  static table = "application_letter_templates"

  @column({ isPrimary: true })
  declare aplLetterTempId: number

  @column()
  declare templateName: string

  @column()
  declare templateImage: string

  @column()
  declare dynamicTemplateImage?: string | null

  @column()
  declare slug: string

  @column()
  declare isCustomBgcolor: string

  @column()
  declare recommendedBgcolor?: string | null

  @column()
  declare price: number

  @column()
  declare discount: number

  @column()
  declare thisOrder: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
