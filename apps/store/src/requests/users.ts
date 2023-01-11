import type { Prisma, PrismaClient } from '@prisma/client'

export const getUserByIdRequest = (client: PrismaClient | Prisma.TransactionClient, userId: string) => client.user.findUnique({ where: { id: userId } })
