import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PlatformReview extends BaseModel {

  static table = "platform_review"

  @column({ isPrimary: true })
  declare pltReviewId: number

  @column()
  declare userId: number

  @column()
  declare review: string

  @column()
  declare rating: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
