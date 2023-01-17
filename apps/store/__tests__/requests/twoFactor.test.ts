import { confirmTwoFactorRequest, saveTwoFactorSecretRequest } from '../../src/requests/twoFactor'
import { prismaMock } from '../mockPrisma'
import { fakeUserInDb } from '../utils/mockAuth'

describe('saveTwoFactorSecretRequest', () => {
  it('should save the two factor secret', async () => {
    prismaMock.user.update.mockResolvedValue(fakeUserInDb)

    expect(await saveTwoFactorSecretRequest(prismaMock, 'goodUserId', 'goodSecret')).toEqual(fakeUserInDb)
  })
})

describe('confirmTwoFactorRequest', () => {
  it('should save the two factor confirmed date', async () => {
    prismaMock.user.update.mockResolvedValue(fakeUserInDb)

    expect(await confirmTwoFactorRequest(prismaMock, 'goodUserId')).toEqual(fakeUserInDb)
  })

  it('should save the two factor confirmed date with custom given date', async () => {
    const fakeUserInDbWithConfirmedDate = {
      ...fakeUserInDb,
      two_factor_confirmed_at: new Date('2021-01-01'),
    }
    prismaMock.user.update.mockResolvedValue(fakeUserInDbWithConfirmedDate)

    expect(await confirmTwoFactorRequest(prismaMock, 'goodUserId')).toEqual(fakeUserInDbWithConfirmedDate)
  })
})

