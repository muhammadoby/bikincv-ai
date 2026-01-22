import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ApplicationLetterArticle extends BaseModel {

  static table = "application_letter_articles"

  @column({ isPrimary: true })
  declare aplArticleId: number

  @column()
  declare aplLetterTempId: number

  @column()
  declare langCode: string

  @column()
  declare json_data: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
