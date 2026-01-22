import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CvExperienceDetail extends BaseModel {

  static table = "cv_experience_details"

  @column({ isPrimary: true })
  declare cvExpDetailId: number

  @column()
  declare orderId?: number | null

  @column()
  declare orderNumber: string

  @column()
  declare cvUserDetailid?: number | null

  @column()
  declare aboutMeHeadTitle?: string | null

  @column()
  declare description?: string | null

  @column()
  declare statusDegre: string

  @column()
  declare cityStudy: string

  @column()
  declare studyPlaceName: string

  @column()
  declare monthStartedStudy: string

  @column()
  declare yearStartedStudy: string

  @column()
  declare monthFinishedStudy: string

  @column()
  declare yearFinishedStudy: string

  @column()
  declare organizationName?: string | null

  @column()
  declare organizationPositionName?: string | null

  @column()
  declare monthStartedOrganization?: string | null

  @column()
  declare yearStartedOrganization?: string | null

  @column()
  declare monthFinishedOrganization?: string | null

  @column()
  declare yearFinishedOrganization?: string | null

  @column()
  declare descriptionOrganization?: string | null

  @column()
  declare achievementName?: string | null

  @column()
  declare monthAchievement?: string | null

  @column()
  declare yearAchievement?: string | null

  @column()
  declare descriptionAchievement?: string | null

  @column()
  declare positionName: string

  @column()
  declare companyName: string

  @column()
  declare companyLocation: string

  @column()
  declare monthStartedWork: string

  @column()
  declare yearStartedWork: string

  @column()
  declare monthFinishedWork: string

  @column()
  declare yearFinishedWork: string

  @column()
  declare descriptionWork?: string | null

  @column()
  declare hobby: string

  @column()
  declare skillName: string

  @column()
  declare skillLevel: string

  @column()
  declare referenceCompanyName: string

  @column()
  declare referencePeopleName: string

  @column()
  declare referencePhone: string

  @column()
  declare referenceEmail: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
