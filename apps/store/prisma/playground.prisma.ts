/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
/**
 * This file is used to test some queries with prisma
 */
const { PrismaClient } = require('@prisma/client')

const prismaClient = new PrismaClient()

const runPlayground = async () => {
  // Write your query here!
  const assets = await prismaClient.user.findMany({
    select: {
      last_name: true,
      first_name: true,
      company: { select: { name: true, id: true, group: true } },
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
