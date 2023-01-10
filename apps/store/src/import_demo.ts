import _knex from 'knex'
import { POSTGRES_URI } from './config/env'
import { log } from './lib/logger'

const knexConnection = _knex({
  client: 'pg',
  connection: POSTGRES_URI,
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
