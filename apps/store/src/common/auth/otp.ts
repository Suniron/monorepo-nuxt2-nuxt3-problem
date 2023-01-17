/**
 * See https://github.com/hectorm/otpauth for the documentation
 */
import * as OTPAuth from 'otpauth'
import { log } from '../../lib/logger'
import { generateBase32String } from '../../utils/random'

const totp = new OTPAuth.TOTP({
  algorithm: 'SHA1',
  digits: 6,
  issuer: 'xrator',
  label: 'xrator',
  period: 30, // code is valid for 30 seconds only

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

export const validateTotpToken = (base32secret: string, token: string) => {
  try {
    totp.secret = OTPAuth.Secret.fromBase32(base32secret)
    const deltaFound = totp.validate({
      token,
      window: 1, // allow 1 previous code (30 seconds) and 1 next code (30 seconds)
    })

    return deltaFound !== null
  }
  catch (error) {
    log.withError(error).error('validateTotpToken')
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

export const getSeedUrlFromSeed = (seed: string) => {
  try {
    totp.secret = OTPAuth.Secret.fromBase32(seed)
    const url = totp.toString()
    return url
  }
  catch (error) {
    log.withError(error).error('getSeedUrlFromSeed')
    throw error
  }
}
