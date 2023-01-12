import type { JwtTokenType, Prisma, PrismaClient } from '@prisma/client'

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

export const saveJwtTokenRequest = (client: PrismaClient | Prisma.TransactionClient, userId: string, token: string, tokenType: JwtTokenType, isFullyConnected = false) => client.user_session.create({
  data: {
    fully_connected: isFullyConnected,
    token,
    type: tokenType,
    user_id: userId,
  },
})

export const getTokenInfoRequest = (client: PrismaClient | Prisma.TransactionClient, token: string) => client.user_session.findUnique({ where: { token } })
