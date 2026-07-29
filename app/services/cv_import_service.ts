import { Infer } from "@vinejs/vine/types";
import CvHelper from "../utils/cv_helper.js";
import { importCvSchema } from "#validators/cv_import_schema";
import HttpException from "#exceptions/http_exception";
import nodemationApiConfig from "../api/nodemation_api.js";
import env from "#start/env";

export class CvImportService extends CvHelper {
  async analyze(payload: Infer<typeof importCvSchema>) {
    try {
      const result = await this.summarize(payload);

      const data = {
        ...result,
        cv_lang: payload.cv_lang,
        user_id: payload.user_id,
        current_date: new Date().toISOString().split('T')[0],
        current_date_readable: new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
      }

      const n8nResponse = await nodemationApiConfig.post(env.get('NOTEMATION_AI_CV_IMPORT_ENDPOINT'), data).then(res => res.data);

      console.log(n8nResponse);

      if (Array.isArray(n8nResponse)) {
        return n8nResponse[0];
      }

      return n8nResponse
    } catch (error: any) {
      throw new HttpException(error.message || "Something went wrong", error.status || 500)
    }
  }
}
