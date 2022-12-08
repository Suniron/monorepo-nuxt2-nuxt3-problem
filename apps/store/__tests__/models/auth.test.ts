// @ts-check
import { prismaMock } from '../mockPrisma'
import { isValidSessionRefreshToken, refreshAccessToken } from '../../src/models/auth'
import { MODEL_ERROR } from '../../src/common/constants'

describe('isValidSessionRefreshToken', () => {
  it('should return false if no result found', async () => {
    prismaMock.user_session.findFirst.mockResolvedValue(null)

    expect(
      await isValidSessionRefreshToken(
        'badRefreshToken',
        '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc'
      )
    ).toBe(false)
  })

  it.skip('should throw error if Prisma crash', () => {
    prismaMock.user_session.findFirst.mockRejectedValue(
      new Error('Prisma error')
    )

    expect(() =>
      isValidSessionRefreshToken(
        'badRefreshToken',
        '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc'
      )
    ).toThrow('Prisma error')
  })

  it('should return true if a user session is found for given refresh token + user id', async () => {
    prismaMock.user_session.findFirst.mockResolvedValue({
      id: '1',
      user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
      token: 'goodRefreshToken',
      created_at: new Date(),
      deleted_at: null,
      type: 'refresh',
    })

    expect(
      await isValidSessionRefreshToken(
        'goodRefreshToken',
        '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc'
      )
    ).toBe(true)
  })
})

describe('refreshAccessToken', () => {
  it('should have model error if Prisma crash during transaction', async () => {
    prismaMock.$transaction.mockRejectedValue(new Error('Prisma error'))

    expect(
      (await refreshAccessToken('1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc'))?.error
    ).toBe(MODEL_ERROR)
  })

  it('should return "accessToken" and "user" if everything is ok', async () => {
    prismaMock.$transaction.mockResolvedValue({
      accessToken: 'accessToken',
      user: {
        id: 'user.id',
        firstName: 'user.first_name',
        lastName: 'user.last_name',
        username: 'user.username',
        email: 'user.email',
        companyId: 'user.company_id',
        companyName: 'user.company_name',
        roles: 'user.roles',
        groups: 'user.groups',
      },
    })

    const result = await refreshAccessToken(
      '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc'
    )

    expect(result?.error).toBeUndefined()
    expect(result?.accessToken).toBeDefined()
    expect(result?.user).toBeDefined()
  })
})
