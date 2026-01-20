import { CvService } from '#services/cv_service';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'
import BaseMessage from '../utils/base_message.js';
import { CvAnalyzeSchema } from '#validators/cv_validator';
import axios from 'axios';
import logger from '@adonisjs/core/services/logger';

@inject()
export default class CvsController {

  constructor(private service: CvService) { }

  /**
   * @analyze
   * @summary Method to analyze CV
   * @description Method to analyze CV
   * @requestBody <CvAnalyzeSchema> - CV file
   */
  async analyze({ request, response }: HttpContext) {
    const payload = await request.validateUsing(CvAnalyzeSchema)

    try {
      const result = await this.service.summarize(payload)

      const n8nResponse = await axios.post(
        'http://localhost:5678/webhook-test/cv/analyze',
        result,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then(res => res.data[0].data)

      return response.status(200).send(BaseMessage<typeof result & { n8nResponse: any }>(true, "Cv analyzed successfully", {
        ...result,
        n8nResponse
      }))
    } catch (error) {
      return response.status(error.status || 500).send(BaseMessage(false, error.message))
    }
  }
}
