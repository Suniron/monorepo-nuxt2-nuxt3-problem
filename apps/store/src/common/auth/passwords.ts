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
 * @param {{ hashSync: (password: string, salt: string) => string }} provider Provides hashing functions
 * @param {string} password Raw password string to be tested against a password hash
 * @param {string} hash Saved password hash
 * @param {string} salt Saved salt used to hash the saved password
 * @returns {boolean} True if passwords' hashes match. False otherwise
 */
export const passwordsMatch = (provider: any, password: any, hash: any, salt: any) => {
  const { hashSync } = provider
  const passwordHashToTest = hashSync(password, salt)

  return passwordHashToTest === hash
}
