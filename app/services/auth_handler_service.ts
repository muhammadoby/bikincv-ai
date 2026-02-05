import HttpException from "#exceptions/http_exception";
import User from "#models/user";
import { signInSchema } from "#validators/sign_in_validator";
import { Infer } from "@vinejs/vine/types";

export class AuthHandlerService {
  /**
   * Method to handle authentication logic from mobile
   */
  async mobileHandler(payload: Infer<typeof signInSchema>) {
    try {

      const user = await User.verifyCredentials(payload.email, payload.password)


      // generate access and refresh token
      const oat = await User.accessTokens.create(user)
      const rt = await User.refreshTokens.create(user)

      return {
        user: user,
        access_token: oat,
        refresh_token: rt,
      }
    } catch (error) {
      throw new HttpException(error.message || "Something went wrong", error.status || 500)
    }
  }


  /**
   * Method to handle authentication logic from web
   */
  async webHandler(payload: Infer<typeof signInSchema>) {
    try {
      const user = await User.verifyCredentials(payload.email, payload.password)

      return {
        user: user,
      }
    } catch (error) {
      throw new HttpException(error.message || "Something went wrong", error.status || 500)
    }
  }

  /**
   * Method to handle logout logic
   */
  async logout(user: User) {
    try {

    } catch (error) {
      throw new HttpException(error.message || "Something went wrong", error.status || 500)
    }
  }
}
