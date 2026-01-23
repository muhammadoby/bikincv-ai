import env from "#start/env"
export default {
  isProduction: env.get('MIDTRANS_IS_PRODUCTION'),
  serverKey: env.get('MIDTRANS_SERVER_KEY'),
  clientKey: env.get('MIDTRANS_CLIENT_KEY'),
}
