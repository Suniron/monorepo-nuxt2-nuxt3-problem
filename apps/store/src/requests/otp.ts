import type { Prisma, PrismaClient } from '@prisma/client'

export const saveTwoFactorSecretRequest = async (client: PrismaClient | Prisma.TransactionClient, userId: string, twoFactorToken: string) => client.user.update({
  data: {
    two_factor_secret: twoFactorToken,
  },
  where: {
    id: userId,
  },
})
