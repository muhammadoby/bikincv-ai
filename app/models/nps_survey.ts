import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class NpsSurvey extends BaseModel {

  static table = "nps_survey"

  @column({ isPrimary: true })
  declare npsSurveyId: number

  @column()
  declare userId: number

  @column()
  declare scale: number

  @column()
  declare scaleReason: string

  @column()
  declare knowFrom: string

  @column()
  declare suggestion: string

  @column()
  declare eachLikeFeature: string

  @column()
  declare dissapointin: string

  @column()
  declare whatToDo: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
