/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { AiThottle } from './limiter.js'
import { middleware } from './kernel.js'

// Lazyload Controller
const BasesController = () => import('#controllers/bases_controller')
const HealthChecksController = () => import('#controllers/health_checks_controller')
const CvsController = () => import('#controllers/cvs_controller')
const PaymentsController = () => import('#controllers/payments_controller')
const SigninsController = () => import('#controllers/signins_controller')

/**
 * Api Routes
 */
router.group(() => {
  router.get('/ping', [BasesController, 'ping'])
  router.get('/health', [HealthChecksController])
  router.post('/payment/callback/:payment_method', [PaymentsController, 'handle'])

  router.group(() => {
    router.post('/analyze', [CvsController, 'analyze']).middleware([
      middleware.auth({ guards: ['api'] })
    ])
  }).prefix('/ai/cv').middleware([
    AiThottle
  ])

  /**
   * Auth routes
   */
  router.post('signin', [SigninsController, 'post'])
}).prefix('/api')
