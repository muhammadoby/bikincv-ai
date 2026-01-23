/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'

export const apiThottle = limiter.define('global', () => {
  return limiter.allowRequests(20).every('1 minute')
})

export const AiThottle = limiter.define('ai', () => {
  return limiter.allowRequests(5).every('1 minute')
})
