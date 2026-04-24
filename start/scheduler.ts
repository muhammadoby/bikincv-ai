
import AutoDeleteCvFile from '#events/auto_delete_cv_file';
import scheduler from 'adonisjs-scheduler/services/main'

scheduler.withoutOverlapping(() => {
  scheduler.call(async () => {
    await AutoDeleteCvFile.dispatch() // run auto delete cv file
  }).everyFiveMinutes();
}, {
  expiresAt: 30_000 // 30 seconds
})
