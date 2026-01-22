import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CvTemplate extends BaseModel {

  static table = "cv_templates"

  @column({ isPrimary: true })
  declare cvTemplateId: number

  @column()
  declare templateName: string

  @column()
  declare templateImage: string

  @column()
  declare dynamicTemplateImage?: string | null

  @column()
  declare slug: string

  @column()
  declare isCustomBgcolor: boolean

  @column()
  declare isAts?: boolean | null

  @column()
  declare professionId?: number | null

  @column()
  declare recommendedBgcolor?: string | null

  @column()
  declare price: number

  @column()
  declare discount: number

  @column()
  declare thisOrder: number

  @column()
  declare status: "draft" | "public"

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
