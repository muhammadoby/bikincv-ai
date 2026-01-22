import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Profession extends BaseModel {

  static table = "profession"

  @column({ isPrimary: true })
  declare professionId: number

  @column()
  declare professionParent?: number | null

  @column()
  declare idName: string

  @column()
  declare enName: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
