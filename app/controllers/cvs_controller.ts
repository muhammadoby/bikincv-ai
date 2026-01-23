import { CvService } from '#services/cv_service';
import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http'
import BaseMessage from '../utils/base_message.js';
import { CvAnalyzeSchema } from '#validators/cv_validator';
import nodemationApiConfig from '../api/nodemation_api.js';
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
      const result = await this.service.summarize(payload)

      // send data to nodemation
      const data = {
        ...result,
        cv_lang: payload.cv_lang,
        language_style: payload.language_style
      }

      const n8nResponse = await nodemationApiConfig.post('/webhook/cv/analyze', data).then(res => res.data)

      logger.info(n8nResponse)

      const safeName = payload.cv_file.clientName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '')

      const generateCvName = `${safeName}-${Date.now()}.${payload.cv_file.extname}`


      // move cv to storage
      await payload.cv_file.moveToDisk(`/cv-analyzer/${generateCvName}`, 'fs')

      // save ai response to db
      await user.related('aiCvAnalyzers').create({
        requestPayload: payload,
        cvRawText: result.raw_text,
        cvParsedJson: result.parsed_json,
        cvMarkdown: result.markdown_version,
        cvPath: `/cv-analyzer/${generateCvName}`,
        aiResponse: Array.isArray(n8nResponse) ? n8nResponse[0] : n8nResponse,
        aiModel: Array.isArray(n8nResponse) ? n8nResponse[0].result.ai_model : n8nResponse.result.ai_model,
      })

      return response.status(200).send(BaseMessage<
        typeof result &
        { selected_language: any } &
        { language_style: any } &
        { ai_response: typeof n8nResponse }

      >(true, "Cv analyzed successfully", {
        ...result,
        selected_language: payload.cv_lang,
        language_style: payload.language_style,
        ai_response: n8nResponse,
      }))
    } catch (error) {
      logger.error(error);
      return response.status(error.status || 500).send(BaseMessage(false, error.message))
    }
  }
}
