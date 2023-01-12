import { generateJwtTokens } from '../../common/auth/jwt'
import { generateBase32Secret, generateTotpToken } from '../../common/auth/otp'
import { UNAUTHORIZED } from '../../common/constants'
import prismaClient from '../../prismaClient'
import { revokeAllUserTokensRequest, saveJwtTokenRequest } from '../../requests/tokens'
import { confirmTwoFactorRequest, saveTwoFactorSecretRequest } from '../../requests/twoFactor'
import { getUserByIdRequest } from '../../requests/users'
import { sanitizeUser } from '../../utils/user.utils'

/**
 * First init (or reset) the TOTP authentication.
 *
 * It will use the current secret or generate a new one if not exists.
 *
 * It will return a new TOTP token.
 */
export const initTotpAuthenticationModel = async (userId: string) => {
  // 1) check if a secret already exists
  const user = await getUserByIdRequest(prismaClient, userId)
  if (!user)
    return { error: UNAUTHORIZED }

  let seed = user.two_factor_secret

  // 2) if not have secret yet, generate a new one and store it in the database:
  if (!seed) {
    const generatedTotpSecret = generateBase32Secret(32)

    const updatedUser = await saveTwoFactorSecretRequest(prismaClient, userId, generatedTotpSecret)
    // It should never happen because it's just updated now:
    if (!updatedUser.two_factor_secret)
      return { error: UNAUTHORIZED }

    seed = updatedUser.two_factor_secret
  }

  return { seed }
}

export const loginWithTotpModel = async (userId: string, totp: number) => {
  // 1) check if a secret already exists
  const user = await getUserByIdRequest(prismaClient, userId)
  if (!user)
    return { error: UNAUTHORIZED }
  if (!user.two_factor_secret && user.is_two_factor_required)
    return { error: UNAUTHORIZED, message: '2FA not initialized yet' }

  // 2) check if the given totp is valid
  let isValidTotp = false
  // With 2fa bypass (for developers):
  if (!user.is_two_factor_required)
    isValidTotp = true
  // For common users:
  else
    isValidTotp = generateTotpToken(user.two_factor_secret as string) === totp.toString()

  if (!isValidTotp)
    return { error: UNAUTHORIZED, message: 'totp not valid' }

  // 3) if the 2fa is not confirmed yet, confirm it
  if (!user.two_factor_confirmed_at)
    await confirmTwoFactorRequest(prismaClient, userId)

  // 4) generate fully connected access & refresh token
  const sanitizedUser = sanitizeUser(user)
  const { accessToken, refreshToken } = generateJwtTokens(sanitizedUser, true)

  // 5) Revoke all existing tokens:
  await revokeAllUserTokensRequest(prismaClient, user.id)

  // 6) Save tokens in DB
  const [accessSession, refreshSession] = await prismaClient.$transaction([
    saveJwtTokenRequest(prismaClient, user.id, accessToken, 'access', true),
    saveJwtTokenRequest(prismaClient, user.id, refreshToken, 'refresh', true),
  ])

  return { accessToken: accessSession.token, refreshToken: refreshSession.token }
}
