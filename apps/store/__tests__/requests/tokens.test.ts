import type { user_session as UserSession } from '@prisma/client'
import { prismaMock } from '../mockPrisma'
import { getTokenInfoRequest, revokeAllUserTokensRequest, saveJwtTokenRequest } from '../../src/requests/tokens'

describe('revokeAllUserTokensRequest', () => {
  it('should have a count of 1 updated token', async () => {
    prismaMock.user_session.updateMany.mockResolvedValue({
      count: 1,
    })

    expect((await revokeAllUserTokensRequest(prismaMock, 'goodUserId'))?.count).toBe(1)
  })
})

describe('storeTokenRequest', () => {
  it('should return the stored access token (not fully connected)', async () => {
    prismaMock.user_session.create.mockResolvedValue({
      created_at: new Date(),
      deleted_at: null,
      fully_connected: false,
      id: 'goodId',
      token: 'goodToken',
      type: 'access',
      user_id: 'goodUserId',
    })

    const storedToken = await saveJwtTokenRequest(prismaMock, 'goodUserId', 'goodToken', 'access')

    expect(storedToken.token).toBe('goodToken')
    expect(storedToken.type).toBe('access')
    expect(storedToken.fully_connected).toBe(false)
  })

  it('should return the stored refresh token (not fully connected)', async () => {
    prismaMock.user_session.create.mockResolvedValue({
      created_at: new Date(),
      deleted_at: null,
      fully_connected: false,
      id: 'goodId',
      token: 'goodToken',
      type: 'refresh',
      user_id: 'goodUserId',
    })

    const storedToken = await saveJwtTokenRequest(prismaMock, 'goodUserId', 'goodToken', 'refresh')

    expect(storedToken.token).toBe('goodToken')
    expect(storedToken.type).toBe('refresh')
    expect(storedToken.fully_connected).toBe(false)
  })

  it('should return the stored access token (fully connected)', async () => {
    prismaMock.user_session.create.mockResolvedValue({
      created_at: new Date(),
      deleted_at: null,
      fully_connected: true,
      id: 'goodId',
      token: 'goodToken',
      type: 'access',
      user_id: 'goodUserId',
    })

    const storedToken = await saveJwtTokenRequest(prismaMock, 'goodUserId', 'goodToken', 'access')

    expect(storedToken.token).toBe('goodToken')
    expect(storedToken.type).toBe('access')
    expect(storedToken.fully_connected).toBe(true)
  })

  it('should return the stored refresh token (fully connected)', async () => {
    prismaMock.user_session.create.mockResolvedValue({
      created_at: new Date(),
      deleted_at: null,
      fully_connected: true,
      id: 'goodId',
      token: 'goodToken',
      type: 'refresh',
      user_id: 'goodUserId',
    })

    const storedToken = await saveJwtTokenRequest(prismaMock, 'goodUserId', 'goodToken', 'refresh')

    expect(storedToken.token).toBe('goodToken')
    expect(storedToken.type).toBe('refresh')
    expect(storedToken.fully_connected).toBe(true)
  })
})

describe('getTokenInfoRequest', () => {
  it('should return the token info', async () => {
    const tokenInfo: UserSession = {
      created_at: new Date(),
      deleted_at: null,
      fully_connected: false,
      id: 'goodId',
      token: 'goodToken',
      type: 'access',
      user_id: 'goodUserId',
    }

    prismaMock.user_session.findUnique.mockResolvedValue(tokenInfo)

    expect(await getTokenInfoRequest(prismaMock, 'goodToken')).toEqual(tokenInfo)
  })
})
