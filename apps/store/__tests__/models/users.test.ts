import type { user } from '@prisma/client'
import { prismaMock } from '../mockPrisma'
import {
  getUserByEmailOrUsername, is2faInitialized,
} from '../../src/models/users'

import { MODEL_ERROR, UNAUTHORIZED } from '../../src/common/constants'
import { fakeUserInDb } from '../utils/mockAuth'

describe('getUserByEmailOrUsername', () => {
  it('Should return model error if prisma throw error', async () => {
    prismaMock.user.findFirst.mockRejectedValue(
      new Error('test: error in prisma'),
    )
    expect((await getUserByEmailOrUsername('myGoodEmail'))?.error).toBe(
      MODEL_ERROR,
    )
  })

  it('Should return a user with data', async () => {
    const expectedUser: user = {
      company_id: 1,
      email: 'myGoodEmail',
      first_name: 'myFirstName',
      id: 'userId',
      is_two_factor_required: true,
      last_name: 'myLastName',
      password: 'password',
      reset_token: 'resetToken',
      roles: ['admin'],
      salt: 'salt',
      token_expires_at: new Date().toString(),
      two_factor_confirmed_at: null,
      two_factor_secret: null,
      username: 'username',
    }
    prismaMock.user.findFirst.mockResolvedValue(expectedUser)

    const user = await getUserByEmailOrUsername('myGoodEmail')

    expect(user?.error).toBe(undefined)
    expect(user?.user).toEqual(expectedUser)
  })

  it('Should return null as user', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null)

    const user = await getUserByEmailOrUsername('myGoodEmail')
    expect(user?.error).toBeUndefined()
    expect(user?.user).toBeNull()
  })
})

describe('is2faInitialized', () => {
  it('should return model error on prisma crash', async () => {
    prismaMock.user.findUnique.mockRejectedValue(
      new Error('test: error in prisma'),
    )
    expect((await is2faInitialized('goodUserId'))?.error).toBe(MODEL_ERROR)
  })

  it('should return unauthorized if userId not exists', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    expect((await is2faInitialized('badUserId'))?.error).toBe(UNAUTHORIZED)
  })

  it('should return is2faInitialized = true if userId exists and have a 2fa secret', async () => {
    prismaMock.user.findUnique.mockResolvedValue(
      { ...fakeUserInDb, two_factor_confirmed_at: new Date(), two_factor_secret: 'myTwoFactorSecret' },
    )
    expect((await is2faInitialized('goodUserId'))?.isInitialized).toBe(true)
  })

  it('should return is2faInitialized = false if userId exists but not 2fa secret', async () => {
    prismaMock.user.findUnique.mockResolvedValue(
      { ...fakeUserInDb, two_factor_secret: null },
    )
    expect((await is2faInitialized('goodUserId'))?.isInitialized).toBe(false)
  })

  it('should return is2faInitialized = true if userId exists and bypass 2fa is enable (for developer for example)', async () => {
    prismaMock.user.findUnique.mockResolvedValue(
      { ...fakeUserInDb, is_two_factor_required: false, two_factor_secret: null },
    )
    expect((await is2faInitialized('goodUserId'))?.isInitialized).toBe(true)
  })
})
