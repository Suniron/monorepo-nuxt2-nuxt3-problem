import crypto from 'crypto'
import * as OTPAuth from 'otpauth'
import { log } from '../../lib/logger'

export const generateTotpToken = (secret: string) => {
  try {
    const totp = new OTPAuth.TOTP({
      label: 'xrator',
      secret,
    })
    return totp.generate()
  }
  catch (error) {
    log.withError(error).error('generateTotpToken')
    throw error
  }
}

export const generateOtpSecret = () => {
  try {
    // Generate a 16-byte buffer of random bytes
    const buffer = crypto.randomBytes(16)

    // Convert the buffer to a hexadecimal string
    return buffer.toString('hex')
  }
  catch (error) {
    log.withError(error).error('generateOtpSecret')
    throw error
  }
}
