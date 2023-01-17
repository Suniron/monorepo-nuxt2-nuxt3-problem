import crypto from 'crypto'
import { encrypt } from 'unixcrypt'

export const genSaltSync = (rounds: any) => {
  if (rounds >= 15)
    throw new Error(`${rounds} is greater than 15,Must be less that 15`)

  if (!rounds)
    rounds = 1000

  return `$6$rounds=${rounds}$${crypto
    .randomBytes(Math.ceil(15 / 2))
    .toString('hex')
    .slice(0, 15)}`
}

export const getHashedPassword = (password: string, salt: string) => {
  const value = encrypt(password, salt)
  return value
}
