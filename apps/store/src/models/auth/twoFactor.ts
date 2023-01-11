import { generateTotpToken } from '../../common/auth/otp'
import { UNAUTHORIZED } from '../../common/constants'
import prismaClient from '../../prismaClient'
import { saveTwoFactorSecretRequest } from '../../requests/otp'
import { getUserByIdRequest } from '../../requests/users'
import { generateString } from '../../utils/random'

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

  let totpSecret = user.two_factor_secret

  // 2) if not have secret yet, generate a new one and store it in the database:
  if (!totpSecret) {
    const generatedTotpSecret = generateString(32)

    const updatedUser = await saveTwoFactorSecretRequest(prismaClient, userId, generatedTotpSecret)
    // It should never happen because it's just updated now:
    if (!updatedUser.two_factor_secret)
      return { error: UNAUTHORIZED }

    totpSecret = updatedUser.two_factor_secret
  }

  // 3) generate a new token
  const token = generateTotpToken(totpSecret)

  return { token }
}
