// @ts-check

// @ts-expect-error TS(2307): Cannot find module '@/lib/logger' or its correspon... Remove this comment to see the full error message
import { log } from '@/lib/logger'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'cron... Remove this comment to see the full error message
import { CronJob } from 'cron'
import { computeRiskForAllCompanies } from './computeRisks'

const COMMON_CRON_PATTERNS = {
  EVERY_MINUTE: '* * * * *',
  EVERY_FIVE_MINUTE: '*/5 * * * *',
  EVERY_HOUR: '0 * * * *',
  EVERY_3_HOURS: '0 */3 * * *',
  EVERY_6_HOURS: '0 */6 * * *',
  EVERY_12_HOURS: '0 */12 * * *',
  EVERY_DAY: '0 0 * * *',
  EVERY_WEEK: '0 0 * * 0',
  EVERY_MONTH: '0 0 1 * *',
  EVERY_YEAR: '0 0 1 1 *',
}

/**
 * @type {{cronPattern: string, onTick: import('cron').CronCommand, job: CronJob | null}[]}
 */
export const tasks = [
  {
    cronPattern: COMMON_CRON_PATTERNS.EVERY_FIVE_MINUTE,
    onTick: computeRiskForAllCompanies,
    job: null,
  },
]

export const initCronTasks = () => {
  // Creating and starting cron jobs
  tasks.forEach((task) => {
    task.job = new CronJob(task.cronPattern, task.onTick)
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    task.job.start()
  })

  log.debug(tasks.length + ' cron tasks initialized')
}
