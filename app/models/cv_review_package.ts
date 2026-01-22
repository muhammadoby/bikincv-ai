import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CvReviewPackage extends BaseModel {

  static table = "cv_review_packages"

  @column({ isPrimary: true })
  declare cvReviewPkgId: number

  @column()
  declare packageName: string

  @column()
  declare price: number

  @column()
  declare discount: number

  @column()
  declare packageDescription: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
