import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static table = 'users'

  @column({ isPrimary: true })
  declare userId: number

  @column()
  declare roleId: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password?: string | null

  @column()
  declare userImage?: string | null

  @column()
  declare userImageDirFlag?: string | null

  @column()
  declare isAvatar?: boolean | null

  @column()
  declare name: string

  @column()
  declare phone?: string | null

  @column({ serializeAs: null })
  declare rememberToken?: string | null

  @column()
  declare isUserSubscribeNewsLetter?: boolean | null

  @column()
  declare status: boolean

  @column()
  declare confirmationCode?: string | null

  @column()
  declare facebookId?: string | null

  @column()
  declare googleId?: string | null

  @column()
  declare appleAccessToken?: string | null

  @column()
  declare appleIdToken?: string | null

  @column()
  declare appleUserIdentifier?: string | null

  @column()
  declare profileOnlineSlug?: string | null

  @column()
  declare profileOnlineSetting?: string | null

  @column()
  declare hasReviewPlatform?: boolean | null

  @column()
  declare hasNpsSurveyPlatform?: boolean | null

  @column()
  declare isRemove?: boolean | null

  @column()
  declare removeAccReason?: string | null

  @column()
  declare isCommunityModerator: boolean

  @column()
  declare isUserAffiliate: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
