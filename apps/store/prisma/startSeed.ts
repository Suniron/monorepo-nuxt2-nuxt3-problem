
import knex from 'knex'

/**
 * Load seeds data in database
 */
export const runSeeders = async () => {
  if (process.env.NODE_ENV !== 'development') {
    console.log('Seed demo + init data...')
  } else {
    console.log('Seed init data...')
  }

  const knexDemoConnection = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI,
    migrations: {
      tableName: 'db_migrations',
    },
    seeds: {},
  })

  await knexDemoConnection.seed.run()
  if (process.env.NODE_ENV !== 'development') {
    console.log('Seed demo + init data finished')
  } else {
    console.log('Seed init data finished')
  }

  await knexDemoConnection.destroy()
}

// Launch the function directly if the script is called directly
if (require.main === module) {
  console.log('Seed database')

  runSeeders().catch((error) => {
    console.log('Error while seeding the database:', error)
    process.exit(1)
  })

  console.log('Database seeding finished !')
}
