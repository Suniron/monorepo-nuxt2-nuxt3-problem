
import prismaClient from './../src/prismaClient'

export const resetDatabase = async () => {
  console.log('Started truncating database 🗑...')
  /**
   * @type {{tablename: string}[]}
   */
  const tablenames = await prismaClient.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`


  for (const { tablename } of tablenames) {
    // Ignore prisma & knex migrations tables
    if (
      ['_prisma_migrations', 'db_migrations', 'db_migrations_lock'].includes(
        tablename
      )
    ) {
      continue
    }

    try {
      await prismaClient.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
      )
      console.log(`Truncated table "${tablename}"`)
    } catch (error) {
      console.log({ error })
    }
  }

  console.log('... Finished truncating database, all data are removed ! 👍')
}

// Launch the function directly if the script is called directly
if (require.main === module) {
  console.log('Truncate database only')

  resetDatabase().catch((error) => {
    console.log('Error while truncating database:', error)
    process.exit(1)
  })

  console.log(
    "Database truncated, you can now run 'yarn db:seed' to seed init data (+ demo data if NODE_ENV=development)"
  )
}
