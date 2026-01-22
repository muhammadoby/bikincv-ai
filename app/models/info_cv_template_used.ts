import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class InfoCvTemplateUsed extends BaseModel {

  static table = "info_cv_template_used"

  @column({ isPrimary: true })
  declare infoCvTuId: number

  @column()
  declare jobCategoryName: string

  @column()
  declare jobCategoryDescription: string

  @column()
  declare dataLists: string

  @column()
  declare thisOrder: number

  @column()
  declare language: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
