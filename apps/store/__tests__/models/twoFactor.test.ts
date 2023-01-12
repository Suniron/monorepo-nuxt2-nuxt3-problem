import { prismaMock } from '../mockPrisma'
import { UNAUTHORIZED } from '../../src/common/constants'
import { initTotpAuthenticationModel, loginWithTotpModel } from '../../src/models/auth/twoFactor'
import { fakeUserInDb } from '../utils/mockAuth'

describe('initTotpAuthenticationModel', () => {
  it('should return unauthorized if user does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    expect((await initTotpAuthenticationModel('badUserId'))?.error).toBe(UNAUTHORIZED)
  })

  it('should generate & save a new secret in bdd and return a token if user 2fa not initialized yet', async () => {
    const user = fakeUserInDb
    prismaMock.user.findUnique.mockResolvedValue(user)
    prismaMock.user.update.mockResolvedValue({ ...user, two_factor_secret: 'newGeneratedSecret' })

    expect((await initTotpAuthenticationModel('goodUserId'))).toHaveProperty('seed')
  })
})

describe('loginWithTotpModel', () => {
  it('should return unauthorized if user does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)

    expect((await loginWithTotpModel('badUserId', 123456))?.error).toBe(UNAUTHORIZED)
  })

  it('should return unauthorized if user 2fa not initialized yet', async () => {
    const user = fakeUserInDb
    prismaMock.user.findUnique.mockResolvedValue({ ...user, two_factor_secret: null })

    expect((await loginWithTotpModel(user.id, 123456))?.error).toBe(UNAUTHORIZED)
    expect((await loginWithTotpModel(user.id, 123456))?.message).toBe('2FA not initialized yet')
  })

  it('should return unauthorized if given totp in not valid', async () => {
    const user = fakeUserInDb
    prismaMock.user.findUnique.mockResolvedValue({ ...user, two_factor_secret: 'myTwoFactorSecret' })

    expect((await loginWithTotpModel(user.id, 123456))?.error).toBe(UNAUTHORIZED)
    expect((await loginWithTotpModel(user.id, 123456))?.message).toBe('totp not valid')
  })

  it('should return access & refresh token if the user have a 2fa bypass', async () => {
    const user = fakeUserInDb
    prismaMock.user.findUnique.mockResolvedValue({ ...user, is_two_factor_required: false, two_factor_secret: null })

    expect((await loginWithTotpModel(user.id, 123456))).toHaveProperty('accessToken')
    expect((await loginWithTotpModel(user.id, 123456))).toHaveProperty('refreshToken')
  })
})
