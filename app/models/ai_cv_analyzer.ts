import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import AiPayment from './ai_payment.js'

export default class AiCvAnalyzer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare orderId: number

  @column()
  declare orderNumber: number

  @column()
  declare requestPayload: object

  @column()
  declare cvRawText: string

  @column()
  declare cvParsedJson: object

  @column()
  declare cvMarkdown: string

  @column()
  declare aiResponse: object

  @column()
  declare aiModel: string

  @column()
  declare cvPath: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'userId',
    foreignKey: 'userId'
  })
  declare user: BelongsTo<typeof User>

  @hasOne(() => AiPayment, {
    localKey: 'id',
    foreignKey: 'aiCvId'
  })
  declare payment: HasOne<typeof AiPayment>
}
