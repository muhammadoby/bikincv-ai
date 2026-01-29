import { CvService } from '#services/cv_service';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'
import BaseMessage from '../utils/base_message.js';
import { CvAnalyzeSchema } from '#validators/cv_validator';
import logger from '@adonisjs/core/services/logger';
import User from '#models/user';

@inject()
export default class CvsController {

  constructor(private service: CvService) { }

  /**
   * @analyze
   * @summary Method to analyze CV
   * @description Method to analyze CV
   * @requestBody <CvAnalyzeSchema> - CV file
   */
  async analyze({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(CvAnalyzeSchema)

    try {
      const user = await User.findByOrFail('user_id', auth.user?.userId)
      const result = await this.service.analyzeCvFile(payload, user)

      return response.status(200).send(BaseMessage(true, "Cv analyzed successfully", result))
    } catch (error) {
      logger.error(error);
      return response.status(error.status || 500).send(BaseMessage(false, error.message))
    }
  }

  /**
   * @history
   * @summary Method to analyze CV
   * @description Method to analyze CV
   * @requestBody <CvAnalyzeSchema> - CV file
   */
  async history({ request, response }: HttpContext) {

    try {

    } catch (error) {
      return response.status(error.status || 500).send(BaseMessage(false, error.message || "Something went wrong"))
    }
  }
}
