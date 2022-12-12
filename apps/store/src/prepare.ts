import _knex from 'knex'
import env from './config/env'

async function waitForDatabase(connectionsCount = 1) {
  return new Promise((resolve) => {
    const connection = _knex({
      client: 'pg',
      connection: env.postgres.URI,
    })

    connection
      .raw('SELECT 1')
      .then(async () => {
        if (connectionsCount === 1) {
          // Connection successful, and no needed tretries, we end the DB connection, and stop the script
          connection.destroy()
          process.exit()
        }
        else {
          // If we need to try to connect again, wait one second, remove the existing connection and retry
          setTimeout(async () => {
            connection.destroy()
            await waitForDatabase(connectionsCount - 1)
          }, 1e3)
        }
      })
      .catch(() => {
        // If DB is not accessible, wait one second and retry
        setTimeout(async () => {
          connection.destroy()
          await waitForDatabase(connectionsCount)

          resolve()
        }, 1e3)
      })
  })
}

// Waiting twice for connection as postgres initialization starts, stops, then starts again
// https://stackoverflow.com/questions/37259584/postgres-shuts-down-immediately-when-started-with-docker-compose
waitForDatabase(2)
