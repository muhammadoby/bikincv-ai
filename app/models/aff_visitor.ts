import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AffVisitor extends BaseModel {

  static table = "aff_visitor"

  @column({ isPrimary: true })
  declare affVisitorId: number

  @column()
  declare affUserId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
