import { getHashedPassword } from './sha512'

/**
 * Returns a password hashed and its salt
 *
 * @param {{
 *   genSaltSync: (round?: number) => string,
 *   hashSync: (password: string, salt: string) => string
 * }} provider Provides hashing functions
 * @param {string} pass Password to be hashed
 * @returns The password hashed and the salt used to hash the password
 */
export const createPasswordHash = (provider: any, pass: any) => {
  const { hashSync, genSaltSync } = provider
  const salt = genSaltSync()
  const hash = hashSync(pass, salt)

  return { hash, salt }
}

/**
 * Compares a raw password with the saved password hash and its salt.
 *
 * Return True if passwords' hashes match. False otherwise.
 */
export const passwordsMatch = (
  /**
   * Provides hashing functions
   */
  provider: { hashSync: (password: string, salt: string) => string },
  /**
   * Raw password string to be tested against a password hash
   */
  password: string,
  /**
   * Saved password hash
   */
  hash: string,
  /**
   * Saved salt used to hash the saved password
   */
  salt: string,
): boolean => {
  const { hashSync } = provider
  const passwordHashToTest = hashSync(password, salt)

  return passwordHashToTest === hash
}

export const doesPlaintextAndHashedPasswordMatch = (
  plaintextPassword: string,
  hashedPassword: string,
  salt: string,
): boolean => {
  const hashedClearPassword = getHashedPassword(plaintextPassword, salt)
  return hashedClearPassword === hashedPassword
}
