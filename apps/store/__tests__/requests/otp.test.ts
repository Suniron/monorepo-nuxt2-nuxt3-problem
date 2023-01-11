import { saveTwoFactorSecretRequest } from '../../src/requests/otp'
import { prismaMock } from '../mockPrisma'
import { fakeUserInDb } from '../utils/mockAuth'

describe('saveTwoFactorSecretRequest', () => {
  it('should save the two factor secret', async () => {
    prismaMock.user.update.mockResolvedValue(fakeUserInDb)

    expect(await saveTwoFactorSecretRequest(prismaMock, 'goodUserId', 'goodSecret')).toEqual(fakeUserInDb)
  })
})
