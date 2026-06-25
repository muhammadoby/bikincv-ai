import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import crypto from 'crypto'
import type { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'
import BaseMessage from '../utils/base_message.js'

export default class RouteMiddleware {
  /**
   * Middleware to protect route with API secret
   */
  async handle(ctx: HttpContext, next: NextFn) {
    const nodeEnv = app.nodeEnvironment
    const debug = nodeEnv === 'development'
    const url = ctx.request.url()

    // check if url starts with /storage/uploads
    if(url.startsWith('/storage/uploads') || url.startsWith('/uploads')) return await next()

    // get secret from header
    const secret = ctx.request.header('x-api-key')

    // get api secret from env
    const apiSecret =
      nodeEnv === 'production'
        ? env.get('API_SECRET_PROD', '')
        : nodeEnv === 'test'
          ? env.get('API_SECRET_STAGING', '')
          : null

    // validation only in production or staging
    if (!debug) {
      if (!secret || !apiSecret) {
        return ctx.response.status(401).send(BaseMessage(false, 'Unauthorized Access'))
      }

      const secretBuffer = Buffer.from(secret)
      const apiSecretBuffer = Buffer.from(apiSecret)

      // compare secret
      if (
        secretBuffer.length !== apiSecretBuffer.length ||
        !crypto.timingSafeEqual(secretBuffer, apiSecretBuffer)
      ) {
        return ctx.response.status(401).send(BaseMessage(false, 'Invalid API secret'))
      }
    } else {
      logger.info('Bypassing API secret check (development mode)')
    }

    const output = await next()
    return output
  }
}
