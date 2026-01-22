import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CvArticle extends BaseModel {
  @column({ isPrimary: true })
  declare cvArticleId: number

  @column()
  declare cvTemplateId: number

  @column()
  declare langCode: string

  @column()
  declare jsonData: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
