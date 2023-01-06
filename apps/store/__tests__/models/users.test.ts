import type { user } from '@prisma/client'
import { prismaMock } from '../mockPrisma'
import {
  getUserByEmailOrUsername,
} from '../../src/models/users'

import { MODEL_ERROR } from '../../src/common/constants'

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
      last_name: 'myLastName',
      password: 'password',
      reset_token: 'resetToken',
      roles: ['admin'],
      salt: 'salt',
      token_expires_at: new Date().toString(),
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
