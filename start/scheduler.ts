
import scheduler from 'adonisjs-scheduler/services/main'
import AutoDeleteCvFile from '../app/jobs/auto_delete_cv_file.js';

scheduler.withoutOverlapping(() => {
  scheduler.call(async () => {
    await AutoDeleteCvFile.fire()
  }).everyFiveMinutes()
}, {
  expiresAt: 30_000
})
