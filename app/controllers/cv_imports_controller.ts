import type { HttpContext } from '@adonisjs/core/http'
import BaseMessage from '../utils/base_message.js'
import app from '@adonisjs/core/services/app'
import { inject } from '@adonisjs/core'
import { CvImportService } from '#services/cv_import_service'
import { importCvSchema } from '#validators/cv_import_schema'

@inject()
export default class CvImportsController {
  constructor(private service: CvImportService) { }

  /**
   * @post
   * @summary Method to import CVs
   * @description Method to import CVs
   */
  async post({ request, response, auth }: HttpContext) {

    const data = await importCvSchema.validate({
      ...request.all(),
      user_id: auth.user?.userId
    });
    try {
      const result = await this.service.analyze(data);

      return response.status(200).send(BaseMessage(true, "Cvs imported successfully", result))
    } catch (error: any) {
      return response.status(error.status || 500).send(BaseMessage(false, app.inProduction ? "Something went wrong" : error.message))
    }
  }
}
