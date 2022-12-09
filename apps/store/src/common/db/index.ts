import _knex from 'knex'
import env from '../../config/env'
import { log } from '../../lib/logger'

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
            ', ',
          )}. Batch #${migrationBatchNumber}`,
        )
      }
      if (currentVersion === 'none')
        knexConnection.seed.run()
    })
})

export const queryDB = (sql: any, params: any) => {
  return knexConnection.raw(sql, params)
}

export const knex = knexConnection
