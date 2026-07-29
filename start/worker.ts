import app from '@adonisjs/core/services/app'
import { Worker } from 'adonisjs-scheduler'

const worker = new Worker(app)

app.ready(async () => {
  await worker.start()
})

app.terminating(async () => {
  await worker.stop()
})
