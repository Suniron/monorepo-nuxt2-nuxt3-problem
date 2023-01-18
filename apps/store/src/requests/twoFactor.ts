import type { Prisma, PrismaClient } from '@prisma/client'

/**
 * Save new two factor secret and reset the confirmed date.
 */
export const saveTwoFactorSecretRequest = async (client: PrismaClient | Prisma.TransactionClient, userId: string, twoFactorToken: string) => client.user.update({
  data: {
    two_factor_confirmed_at: null,
    two_factor_secret: twoFactorToken,
  },
  where: {
    id: userId,
  },
})

/**
 * Confirm the two factor authentication.
 *
 * You should give a custom date, otherwise it will use the current date by default.
 */
export const confirmTwoFactorRequest = async (client: PrismaClient | Prisma.TransactionClient, userId: string, twoFactorConfirmedAt: Date = new Date()) => client.user.update({
  data: {
    two_factor_confirmed_at: twoFactorConfirmedAt,
  },
  where: {
    id: userId,
  },
})
