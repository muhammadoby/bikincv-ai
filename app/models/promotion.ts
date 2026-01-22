import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Promotion extends BaseModel {

  static table = "promotions"

  @column({ isPrimary: true })
  declare promotionId: number

  @column()
  declare name: string

  @column()
  declare shortDescription: string

  @column()
  declare featImg: string

  @column()
  declare buttonCaption: string

  @column()
  declare buttonLink: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
