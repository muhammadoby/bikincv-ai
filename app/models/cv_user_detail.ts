import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CvUserDetail extends BaseModel {

  static table = "cv_user_details"

  @column({ isPrimary: true })
  declare cvUserDetailId: number

  @column()
  declare orderId?: number | null

  @column()
  declare orderNumber: string

  @column()
  declare userImage: string

  @column()
  declare userImageDirFlag?: string | null

  @column()
  declare fullName?: string | null

  @column()
  declare firstName?: string | null

  @column()
  declare birthPlace: string

  @column()
  declare dateBirth: Date

  @column()
  declare gender: string

  @column()
  declare religion?: string | null

  @column()
  declare maritalStatus?: string | null

  @column()
  declare phone: string

  @column()
  declare address: string

  @column()
  declare city: string

  @column()
  declare country: string

  @column()
  declare identifyNum?: string | null

  @column()
  declare citizenship?: string | null

  @column()
  declare linkedin?: string | null

  @column()
  declare website?: string | null

  @column()
  declare facebook?: string | null

  @column()
  declare instagram?: string | null

  @column()
  declare email?: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
