import type { user_session as UserSession } from '@prisma/client'
import { prismaMock } from '../mockPrisma'
import { getTokenInfoRequest, revokeAllUserTokensRequest, storeTokenRequest, upgradeTokenToFullyConnectedRequest } from '../../src/requests/tokens'

describe('revokeAllUserTokensRequest', () => {
  it('should have a count of 1 updated token', async () => {
    prismaMock.user_session.updateMany.mockResolvedValue({
      count: 1,
    })

    expect((await revokeAllUserTokensRequest(prismaMock, 'goodUserId'))?.count).toBe(1)
  })
})

describe('storeTokenRequest', () => {
  it('should return the stored access token', async () => {
    prismaMock.user_session.create.mockResolvedValue({
      created_at: new Date(),
      deleted_at: null,
      fully_connected_at: null,
      id: 'goodId',
      token: 'goodToken',
      type: 'access',
      user_id: 'goodUserId',
    })

    const storedToken = await storeTokenRequest(prismaMock, 'goodUserId', 'goodToken', 'access')

    expect(storedToken.token).toBe('goodToken')
    expect(storedToken.type).toBe('access')
  })

  it('should return the stored refresh token', async () => {
    prismaMock.user_session.create.mockResolvedValue({
      created_at: new Date(),
      deleted_at: null,
      fully_connected_at: null,
      id: 'goodId',
      token: 'goodToken',
      type: 'refresh',
      user_id: 'goodUserId',
    })

    const storedToken = await storeTokenRequest(prismaMock, 'goodUserId', 'goodToken', 'refresh')

    expect(storedToken.token).toBe('goodToken')
    expect(storedToken.type).toBe('refresh')
  })
})

describe('upgradeTokenToFullyConnected', () => {
  it('should return the upgraded access token with a fully_connected_at non-null date', async () => {
    const fully_connected_at = new Date()
    prismaMock.user_session.update.mockResolvedValue({
      created_at: new Date(),
      deleted_at: null,
      fully_connected_at,
      id: 'goodId',
      token: 'goodToken',
      type: 'access',
      user_id: 'goodUserId',
    })

    expect((await upgradeTokenToFullyConnectedRequest(prismaMock, 'goodToken'))?.fully_connected_at).toBe(fully_connected_at)
  })
})

describe('getTokenInfoRequest', () => {
  it('should return the token info', async () => {
    const tokenInfo: UserSession = {
      created_at: new Date(),
      deleted_at: null,
      fully_connected_at: null,
      id: 'goodId',
      token: 'goodToken',
      type: 'access',
      user_id: 'goodUserId',
    }

    prismaMock.user_session.findUnique.mockResolvedValue(tokenInfo)

    expect(await getTokenInfoRequest(prismaMock, 'goodToken')).toEqual(tokenInfo)
  })
})
