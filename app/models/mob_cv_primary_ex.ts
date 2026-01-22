import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MobCvPrimaryEx extends BaseModel {

  static table = "mob_cv_primary_ex"

  @column({ isPrimary: true })
  declare mobCvPrimaryExId: number

  @column()
  declare name: string

  @column()
  declare link?: string | null

  @column()
  declare thisOrder: number

  @column()
  declare language: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
