import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Order extends BaseModel {

  static table = "orders"

  @column({ isPrimary: true })
  declare orderId: number

  @column()
  declare userId: number

  @column()
  declare cvTemplateId?: number | null

  @column()
  declare aplLetterTempId: number | null

  @column()
  declare orderNumber?: string | null

  @column()
  declare cvEmail: string

  @column()
  declare cvStructure: string

  @column()
  declare cvPageBreak: string

  @column()
  declare cvTotalStructure: number

  @column()
  declare orderStatus: number

  @column()
  declare isActive: boolean

  @column()
  declare isBirthYear: boolean

  @column()
  declare isShowSkill: boolean

  @column()
  declare language: string

  @column()
  declare snapToken?: string | null

  @column()
  declare midTransactionUrl?: string | null

  @column()
  declare cvCustomBgcolor?: string | null

  @column()
  declare aplLetCustomBgcolor?: string | null

  @column()
  declare totalPrice?: number | null

  @column()
  declare couponCode?: string | null

  @column()
  declare activePeriod?: number | null

  @column()
  declare totalDownloadCV?: number | null

  @column()
  declare totalDownloadAppLetter?: number | null

  @column()
  declare isFromAffiliate: number

  @column()
  declare totalCutAffiliatePrice?: number | null

  @column()
  declare isFromWeb: boolean

  @column()
  declare isRemove: boolean

  @column()
  declare isCopied: boolean

  @column()
  declare copiedFromOrder?: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
