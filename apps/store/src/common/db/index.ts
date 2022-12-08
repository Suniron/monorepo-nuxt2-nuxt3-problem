import _knex from 'knex'
// @ts-expect-error TS(2307): Cannot find module '@/config/env' or its correspon... Remove this comment to see the full error message
import env from '@/config/env'
// @ts-expect-error TS(2307): Cannot find module '@/lib/logger' or its correspon... Remove this comment to see the full error message
import { log } from '@/lib/logger'

const knexConnection = _knex({
  client: 'pg',
  connection: env.postgres.URI,
  migrations: {
    tableName: 'db_migrations',
  },
  seeds: {},
})

knexConnection.migrate.currentVersion().then((currentVersion) => {
  // Adding user param accessible to the migrations only to avoid running them on app setup (dry-run)
  knexConnection
    .withUserParams({ isSetup: currentVersion === 'none' })
    .migrate.latest()
    .then(([migrationBatchNumber, migrationsRan]) => {
      if (migrationsRan.length) {
        log.info(
          `Finished running migrations ${migrationsRan.join(
            ', '
          )}. Batch #${migrationBatchNumber}`
        )
      }
      if (currentVersion === 'none') {
        knexConnection.seed.run()
      }
    })
})

export const queryDB = (sql: any, params: any) => {
  return knexConnection.raw(sql, params)
}

export const knex = knexConnection
