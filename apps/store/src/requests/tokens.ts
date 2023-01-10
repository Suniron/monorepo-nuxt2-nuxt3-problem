import type { Prisma, PrismaClient } from '@prisma/client'
import type { JWTTokenType } from '../common/auth/jwt'

/**
 * Revokes all user tokens (`access` and `refresh`) by setting the `deleted_at` field to the current date.
 */
export const revokeAllUserTokensRequest = (client: PrismaClient | Prisma.TransactionClient, userId: string) => client.user_session.updateMany({
  data: {
    deleted_at: new Date(),
  },
  where: {
    user_id: userId,
  },
})

export const storeTokenRequest = (client: PrismaClient | Prisma.TransactionClient, userId: string, token: string, tokenType: JWTTokenType) => client.user_session.create({
  data: {
    token,
    type: tokenType,
    user_id: userId,
  },
})

/**
 * It change the `fully_connected_at` field to the current date.
 *
 * Optionally, you can pass a custom upgrade date.
 */
export const upgradeTokenToFullyConnected = (client: PrismaClient | Prisma.TransactionClient, token: string, upgradeDate = new Date()) => client.user_session.update({
  data: {
    fully_connected_at: upgradeDate,
  },
  where: {
    token,
  },
})
