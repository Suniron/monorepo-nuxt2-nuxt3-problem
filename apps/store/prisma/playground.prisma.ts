/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * This file is used to test some queries with prisma
 */
const { PrismaClient } = require('@prisma/client')

const prismaClient = new PrismaClient()

const runPlayground = async () => {
  // Write your query here!
  const assets = await prismaClient.user.findMany({
    select: {
      company: { select: { group: true, id: true, name: true } },
      first_name: true,
      last_name: true,
    },
    where: {
      roles: {
        has: 'admin',
      },
    },
  })

  console.dir(assets, { depth: 10 })

  await prismaClient.$disconnect()
}

runPlayground()
