import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ResetPassword extends BaseModel {

  static table = "reset_passwords"

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare resetToken: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
