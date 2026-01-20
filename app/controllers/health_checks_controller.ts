import { healthChecks } from '#start/health'
import type { HttpContext } from '@adonisjs/core/http'
import BaseMessage from '../utils/base_message.js'

export default class HealthChecksController {
  /**
   * @handle
   * @summary Method to handle health checks
   * @description Method to handle health checks
   */
  async handle({ response }: HttpContext) {
    const report = await healthChecks.run()

    if (report.isHealthy) {
      return response.status(200).send(BaseMessage(true, "Service is healthy", report))
    }

    return response.status(503).send(BaseMessage(false, "Service is unhealthy", report))
  }
}
