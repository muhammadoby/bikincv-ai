import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Promo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare thumbnail?: string | null

  @column()
  declare name: string

  @column()
  declare description?: string | null

  @column()
  declare code: string

  @column()
  declare forMobile?: boolean | null

  @column()
  declare forWeb?: boolean | null

  @column()
  declare slug: string

  @column()
  declare startDate: Date

  @column()
  declare endDate: Date

  @column()
  declare discountValue: number

  @column()
  declare discountType: "fixed" | "percentage"

  @column()
  declare isAutoUse: boolean

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
