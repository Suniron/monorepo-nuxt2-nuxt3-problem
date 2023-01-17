import * as OTPAuth from 'otpauth'
import { log } from '../../lib/logger'
import { generateBase32String } from '../../utils/random'

const totp = new OTPAuth.TOTP({
  label: 'xrator',
  period: 60, // code is valid for 60 seconds
})
/**
 * Generate a new TOTP token based with given base32 secret.
 */
export const generateTotpToken = (base32secret: string) => {
  try {
    totp.secret = OTPAuth.Secret.fromBase32(base32secret)
    return totp.generate()
  }
  catch (error) {
    log.withError(error).error('generateTotpToken')
    throw error
  }
}

export const generateBase32Secret = (length: number) => {
  try {
    const randomKey = generateBase32String(length)
    return randomKey
  }
  catch (error) {
    log.withError(error).error('generateOtpSecret')
    throw error
  }
}
