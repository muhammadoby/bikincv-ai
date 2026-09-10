import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import AiCvAnalyzer from './ai_cv_analyzer.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class AiPayment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare aiCvId: number

  @column()
  declare paymentMethod: "midtrans" | "xendit" | "play_billing"

  @column()
  declare totalAmount: number

  @column()
  declare promoId?: number | null

  @column()
  declare orderId: string

  @column()
  declare totalPaid: number

  @column()
  declare status: "pending" | "paid" | "failed" | "expired"

  @column({
    prepare: (value) => {
      if (!value) return null
      return JSON.stringify(value)
    },
    consume: (value) => {
      if (!value) return null
      if (typeof value === 'object') return value
      return JSON.parse(value)
    },
  })
  declare gatewayResponse?: any

  @column()
  declare channel?: string | null;

  @column()
  declare gatewayToken?: string | null;

  @column.dateTime()
  declare expiresAt?: DateTime | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => AiCvAnalyzer, {
    localKey: 'id',
    foreignKey: 'aiCvId'
  })
  declare aiCvAnalyzer: BelongsTo<typeof AiCvAnalyzer>
}
