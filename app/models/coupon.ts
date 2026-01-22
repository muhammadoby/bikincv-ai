import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Coupon extends BaseModel {

  static table = "coupon"

  @column({ isPrimary: true })
  declare couponId: number

  @column()
  declare couponCode: string

  @column()
  declare couponDescription?: string | null

  @column()
  declare discount: number

  @column()
  declare validFrom: Date

  @column()
  declare validUntil: Date

  @column()
  declare isValidFPackage?: boolean | null

  @column()
  declare isValidFCvOnly?: boolean | null

  @column()
  declare isValidFAppletterOnly?: boolean | null

  @column()
  declare eachTemplateSlugAvailable?: string | null

  @column()
  declare isMustLogin?: boolean | null

  @column()
  declare limitDownloadPerAcc?: number | null

  @column()
  declare isValidFApp: boolean

  @column()
  declare isValidFWeb: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
