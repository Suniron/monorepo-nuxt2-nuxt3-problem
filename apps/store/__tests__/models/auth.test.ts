import { prismaMock } from '../mockPrisma'
import { isValidSessionRefreshToken, refreshAccessToken } from '../../src/models/auth'
import { MODEL_ERROR } from '../../src/common/constants'

describe('isValidSessionRefreshToken', () => {
  it('should return false if no result found', async () => {
    prismaMock.user_session.findFirst.mockResolvedValue(null)

    expect(
      await isValidSessionRefreshToken(
        'badRefreshToken',
        '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
      ),
    ).toBe(false)
  })

  it('should throw error if Prisma crash', async () => {
    prismaMock.user_session.findFirst.mockRejectedValue(
      new Error('Prisma error'),
    )

    expect(
      await isValidSessionRefreshToken(
        'badRefreshToken',
        '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
      ),
    ).toBeFalsy()
  })

  it('should return true if a user session is found for given refresh token + user id', async () => {
    prismaMock.user_session.findFirst.mockResolvedValue({
      created_at: new Date(),
      deleted_at: null,
      id: '1',
      token: 'goodRefreshToken',
      type: 'refresh',
      user_id: '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
    })

    expect(
      await isValidSessionRefreshToken(
        'goodRefreshToken',
        '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
      ),
    ).toBe(true)
  })
})

describe('refreshAccessToken', () => {
  it('should have model error if Prisma crash during transaction', async () => {
    prismaMock.$transaction.mockRejectedValue(new Error('Prisma error'))

    expect(
      (await refreshAccessToken('1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc'))?.error,
    ).toBe(MODEL_ERROR)
  })

  it('should return "accessToken" and "user" if everything is ok', async () => {
    prismaMock.$transaction.mockResolvedValue({
      accessToken: 'accessToken',
      user: {
        companyId: 'user.company_id',
        companyName: 'user.company_name',
        email: 'user.email',
        firstName: 'user.first_name',
        groups: 'user.groups',
        id: 'user.id',
        lastName: 'user.last_name',
        roles: 'user.roles',
        username: 'user.username',
      },
    })

    const result = await refreshAccessToken(
      '1a3f30d8-a8fb-4f93-be14-5ba55e5a4bdc',
    )

    expect(result?.error).toBeUndefined()
    expect(result?.accessToken).toBeDefined()
    expect(result?.user).toBeDefined()
  })
})
