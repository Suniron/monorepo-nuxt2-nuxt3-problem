import 'module-alias/register'
// @ts-expect-error TS(2307): Cannot find module '@/config/env' or its correspon... Remove this comment to see the full error message
import env from '@/config/env'
import _knex from 'knex'

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
        } else {
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
          // @ts-expect-error TS(2794): Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
          resolve()
        }, 1e3)
      })
  })
}

// Waiting twice for connection as postgres initialization starts, stops, then starts again
// https://stackoverflow.com/questions/37259584/postgres-shuts-down-immediately-when-started-with-docker-compose
waitForDatabase(2)
