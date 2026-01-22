import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ManageRepo extends BaseModel {

  static table = "manage_repo"

  @column({ isPrimary: true })
  declare mngRepoId: number

  @column()
  declare section: string

  @column()
  declare dataInfo: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
