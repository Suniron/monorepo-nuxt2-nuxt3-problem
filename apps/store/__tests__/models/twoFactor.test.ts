import { prismaMock } from '../mockPrisma'
import { UNAUTHORIZED } from '../../src/common/constants'
import { initTotpAuthenticationModel } from '../../src/models/auth/twoFactor'
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

    expect((await initTotpAuthenticationModel('goodUserId'))).toHaveProperty('token')
  })
})
