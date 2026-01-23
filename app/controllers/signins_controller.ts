import type { HttpContext } from '@adonisjs/core/http'
import BaseMessage from '../utils/base_message.js'
import { signInSchema } from '#validators/sign_in_validator'
import User from '#models/user'

export default class SigninsController {
  /**
   * @post
   * @summary Method to sign in user
   * @description Method to sign in user
   * @requestBody <SignInSchema>
   */
  async post({ request, response }: HttpContext) {
    const payload = await request.validateUsing(signInSchema)

    try {
      const user = await User.verifyCredentials(payload.email, payload.password)

      const token = await User.accessTokens.create(user, ['*'], {
        name: "Access token"
      })

      return response.status(200).send(BaseMessage(true, "User logged in successfully", {
        user,
        token: token
      }))

    } catch (error) {
      return response.status(error.status || 500).send(BaseMessage(false, error.message))
    }
  }
}
