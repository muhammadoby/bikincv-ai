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
import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import StringHelpers from '../app/helpers/string_helpers.js'

router.get('mail', async ({view}: HttpContext) => {
  return view.render('mail/payment_success', {
    user: await User.first(),
    orderNumber: "123456",
    totalPaid: StringHelpers.formatCurrency(29000)
  })
})

/**
 * Api Routes
 */
router.group(() => {
  router.get('/ping', [BasesController, 'ping'])
  router.get('/health', [HealthChecksController])
  router.post('/payment/callback/:payment_method', [PaymentsController, 'handle'])

  router.group(() => {
    router.post('/analyze', [CvsController, 'analyze'])
    router.get('/history', [CvsController, 'history'])
    router.get('/history/:id', [CvsController, 'show'])
    router.post('/pay/:id', [CvsController, 'pay'])
  }).prefix('/ai/cv').middleware([
    AiThottle,
    middleware.auth({ guards: ['api'] })
  ])

  /**
   * Auth routes
   */
  router.post('signin', [SigninsController, 'post'])
  router.post('logout', [SigninsController, 'logout']).middleware([
    middleware.auth({ guards: ['api'] })
  ])
}).prefix('/api')
