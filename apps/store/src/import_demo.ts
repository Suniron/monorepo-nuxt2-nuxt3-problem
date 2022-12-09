import 'module-alias/register'
import _knex from 'knex'
import env from './config/env'
import { log } from './lib/logger'

const knexConnection = _knex({
  client: 'pg',
  connection: env.postgres.URI,
  seeds: {},
})

async function runSeeders() {
  try {
    await knexConnection.seed.run() // Run the seeders
    log.info('Seeding complete')
  }
  catch (e) {
    log.withError(e).error('runSeeders error')
  }
  knexConnection.destroy() // Closes the connection to end the script (prevents process hanging)
}

runSeeders()
