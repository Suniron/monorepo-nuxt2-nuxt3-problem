import { verifyToken } from '../../common/auth/jwt'
import { MODEL_ERROR, UNAUTHORIZED } from '../../common/constants'
import prismaClient from '../../prismaClient'
import { getTokenInfoRequest } from '../../requests/tokens'
import { generateNewTokensAndRevokeOldOnes } from '.'

export const renewRefreshTokenModel = async (refreshToken: string) => {
  // 1) Verify refresh token validity
  const { error, payload, errorMessage } = verifyToken(refreshToken, 'refresh')
  if (error)
    return { error, message: errorMessage }

  const userInfo = {
    companyId: payload.companyId,
    companyName: payload.companyName,
    email: payload.email,
    firstName: payload.firstName,
    fullyConnected: payload.fullyConnected,
    id: payload.id,
    lastName: payload.lastName,
    roles: payload.roles,
    username: payload.username,
  }

  // 2) Verify refresh token existence in DB
  const refreshTokenInfo = await getTokenInfoRequest(prismaClient, refreshToken)
  if (!refreshTokenInfo)
    return { error: UNAUTHORIZED, message: 'given refresh token not found, sign-in is needed' }
  else if (refreshTokenInfo.deleted_at)
    return { error: UNAUTHORIZED, message: 'given refresh token has been revoked, sign-in is needed' }
  else if (refreshTokenInfo.type !== 'refresh')
    return { error: UNAUTHORIZED, message: 'given refresh token is not a refresh token, sign-in is needed' }

  // 3) Generate new tokens
  const { accessSession, refreshSession } = await generateNewTokensAndRevokeOldOnes(userInfo,
  )
  if (!accessSession.token || !refreshSession.token)
    return { error: MODEL_ERROR }

  // 4) Return new tokens
  return { accessToken: accessSession.token, refreshToken: refreshSession.token, user: userInfo }
}
