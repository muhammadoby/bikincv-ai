import { CvService } from '#services/cv_service';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'
import BaseMessage from '../utils/base_message.js';
import { CvAnalyzeSchema, CvPaymentSchema } from '#validators/cv_validator';
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
  async history({ response, auth }: HttpContext) {

    try {
      const user = auth.getUserOrFail();
      const history = await this.service.getCvAnalysisHistory(user);

      return response.status(200).send(BaseMessage(true, "Cv analysis history fetched successfully", history))
    } catch (error) {
      return response.status(error.status || 500).send(BaseMessage(false, error.message || "Something went wrong"))
    }
  }

  /**
   * @show
   * @summary Method to get CV Analysis details
   * @description Method to get CV Analysis details
   */
  async show({ params, response, auth }: HttpContext) {
    try {
      const user = auth.getUserOrFail();
      const aiCvAnalyzer = await this.service.showCvHistory(user, params.id);

      return response.status(200).send(BaseMessage(true, "Cv analysis details fetched successfully", aiCvAnalyzer))
    } catch (error) {
      return response.status(error.status || 500).send(BaseMessage(false, error.message || "Something went wrong"))
    }
  }

  /**
   * @pay
   * @summary Method to pay for CV Analysis
   * @description Method to pay for CV Analysis
   */
  async pay({ params, response, request, auth }: HttpContext) {
    const { id } = params;
    const payload = await request.validateUsing(CvPaymentSchema)
    try {
      const user = auth.getUserOrFail()

      const payment = await this.service.payForCvAnalysis(user, Number(id), payload);

      return response.status(200).send(BaseMessage(true, "Payment processed", payment))
    } catch (error) {
      return response.status(error.status || 500).send(BaseMessage(false, error.message || "Something went wrong"));
    }
  }

}
