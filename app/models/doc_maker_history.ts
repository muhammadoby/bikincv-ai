import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class DocMakerHistory extends BaseModel {

  static table = "doc_maker_history"

  @column({ isPrimary: true })
  declare docMhisId: number

  @column()
  declare json: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
