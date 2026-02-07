import type { HttpContext } from '@adonisjs/core/http'
import BaseMessage from '../utils/base_message.js'
import { signInSchema } from '#validators/sign_in_validator'
import { inject } from '@adonisjs/core'
import { AuthHandlerService } from '#services/auth_handler_service'
import User from '#models/user'
import HttpException from '#exceptions/http_exception'

@inject()
export default class SigninsController {
  constructor(private handler: AuthHandlerService) { }
  /**
   * @post
   * @summary Method to sign in user
   * @description Method to sign in user
   * @requestBody <signInSchema> - User credentials
   */
  async post({ request, response }: HttpContext) {
    const payload = await request.validateUsing(signInSchema)
    const isMobile = request.header('x-client-type') === 'mobile' || request.input('client_type') === 'mobile'

    try {
      if (!isMobile) {
        const result = await this.handler.mobileHandler(payload)
        return response.status(200).send(BaseMessage(true, "User logged in successfully", result))
      }

      const result = await this.handler.webHandler(payload)
      return response.status(200).send(BaseMessage(true, "User logged in successfully", result))

    } catch (error: any) {
      return response.status(error.status || 500).send(BaseMessage(false, error.message))
    }
  }

  /**
   * @logout
   * @summary Method to logout user
   * @description Method to logout user
   */
  async logout({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const token = auth.use('api').user?.currentAccessToken?.identifier
      if (!token) {
        throw new HttpException('No access token found', 400)
      }
      await User.accessTokens.delete(user, token)
      return response.status(200).send(BaseMessage(true, "User logged out successfully"))
    } catch (error: any) {
      return response.status(error.status || 500).send(BaseMessage(false, error.message))
    }
  }
}
