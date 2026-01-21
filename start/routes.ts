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

// Lazyload Controller
const BasesController = () => import('#controllers/bases_controller')
const HealthChecksController = () => import('#controllers/health_checks_controller')
const CvsController = () => import('#controllers/cvs_controller')

router.jobs('/my-jobs-dashboard')

/**
 * Api Routes
 */
router.group(() => {
  router.get('/ping', [BasesController, 'ping'])
  router.get('/health', [HealthChecksController])


  router.group(() => {
    router.post('/analyze', [CvsController, 'analyze'])
  }).prefix('/ai/cv').middleware([
    AiThottle
  ])
}).prefix('api')
