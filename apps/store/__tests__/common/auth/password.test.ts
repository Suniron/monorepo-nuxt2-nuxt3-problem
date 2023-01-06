import { doesPlaintextAndHashedPasswordMatch } from '../../../src/common/auth/passwords'

describe('doesPlaintextAndHashedPasswordMatch', () => {
  it('should throw an error with invalid sha256 or sha512 (bad salt)', () => {
    expect(() => doesPlaintextAndHashedPasswordMatch('password', 'hashedPassword', 'badSalt')).toThrowError()
  })

  it('should return true if the password matches the hash', () => {
    const password = 'P@ssw0rd'
    const hashedPassword = '$6$k0R5arXFGDx80oUT$csmMAe7wM.qWgxgbZexiNGGmQQUPtXlgJF7V4/2pDPsd5PbCRrJ8DAXL9MeOVm6OdG9BvHiztQVS3NAYR4dB7.'
    const salt = '$6$k0R5arXFGDx80oUT'
    expect(doesPlaintextAndHashedPasswordMatch(password, hashedPassword, salt)).toBe(true)
  })
})
