import type { JwtTokenType, user as User } from '@prisma/client'
import { MODEL_ERROR, VALIDATION_ERROR } from '../../common/constants'
import { log } from '../../lib/logger'
import prismaClient from '../../prismaClient'

// TODO: remove if not used
export const saveTokens = async (userId: User['id'], tokensToSave: { token: string; tokenType: JwtTokenType }[]) => {
  try {
    // Check size of given token list
    if (tokensToSave.length < 1 || tokensToSave.length > 2) {
      log.error(`saveTokens: tokensToSave.length < 1 || tokensToSave.length > 2: ${JSON.stringify(tokensToSave)}`)
      return { error: VALIDATION_ERROR }
    }

    // Check if same token type is present more than once
    const accessTokenCount = tokensToSave.filter(({ tokenType }) => tokenType === 'access').length
    const refreshTokenCount = tokensToSave.filter(({ tokenType }) => tokenType === 'refresh').length
    if (accessTokenCount > 1 || refreshTokenCount > 1) {
      log.error(`saveTokens: accessTokenCount > 1 || refreshTokenCount > 1: ${JSON.stringify(tokensToSave)}`)
      return { error: VALIDATION_ERROR }
    }

    // TODO: Invalidate all previous tokens

    // TODO: Save new tokens
    await prismaClient.user_session.createMany({
      data: tokensToSave.map(({ token, tokenType }) => ({
        token,
        type: tokenType,
        user_id: userId,
      })),
    })
  }
  catch (error) {
    log.withError(error).error('saveTokens')
    return { error: MODEL_ERROR }
  }
}
