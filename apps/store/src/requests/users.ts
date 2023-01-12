import type { Prisma, PrismaClient } from '@prisma/client'

export const getUserByIdRequest = (client: PrismaClient | Prisma.TransactionClient, userId: string) => client.user.findUnique({ where: { id: userId } })

export const getUserAndCompanyNameByIdRequest = (client: PrismaClient | Prisma.TransactionClient, userId: string) => client.user.findUnique({ include: { company: { select: { name: true } } }, where: { id: userId } })
