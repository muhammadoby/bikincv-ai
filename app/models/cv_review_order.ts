import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CvReviewOrder extends BaseModel {

  static table = "cv_review_orders"

  @column({ isPrimary: true })
  declare cvReviewOrderId: number

  @column()
  declare cvReviewPkgId?: number | null

  @column()
  declare userId: number

  @column()
  declare cvFileName: string

  @column()
  declare additionalData?: string | null

  @column()
  declare paymentStatus?: number | null

  @column()
  declare isReviewed?: boolean | null

  @column()
  declare reviewAttachment?: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
