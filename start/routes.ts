/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// Lazyload Controller
const BasesController = () => import('#controllers/bases_controller')
const HealthChecksController = () => import('#controllers/health_checks_controller')
const CvsController = () => import('#controllers/cvs_controller')


/**
 * Api Routes
 */
router.group(() => {
  router.get('/ping', [BasesController, 'ping'])
  router.get('/health', [HealthChecksController])


  router.group(() => {
    router.post('/analyze', [CvsController, 'analyze'])
  }).prefix('/cv')
}).prefix('api')
