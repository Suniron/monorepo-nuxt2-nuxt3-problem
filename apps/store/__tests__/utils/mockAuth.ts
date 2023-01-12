import type { user as User, user_session as UserSession } from '@prisma/client'
import { prismaMock } from '../mockPrisma'
import type { JwtTokenPayloadInput } from '../../src/common/auth/jwt'
import { generateJwtTokens } from '../../src/common/auth/jwt'
import type { OptionalUserInfo } from '../../types/user'

const fakeLoggedUser: JwtTokenPayloadInput = {
  companyId: 1,
  companyName: 'DefaultValue',
  email: 'DefaultValue@xrator.fr',
  firstName: 'DefaultValue',
  fullyConnected: false,
  id: '5dfa3005-5f8f-41f6-befe-bb1603e6dd9c',
  lastName: 'DefaultValue',
  roles: [],
  username: 'DefaultValued',
}

export const fakeUserInDb: User = {
  company_id: 1,
  email: 'unittest@xrator.com',
  first_name: 'Etienne',
  id: 'cfaa596f-efa7-4af1-9e37-fbf221b45f60',
  is_two_factor_required: true,
  last_name: 'Blanc',
  password: '$6$k0R5arXFGDx80oUT$csmMAe7wM.qWgxgbZexiNGGmQQUPtXlgJF7V4/2pDPsd5PbCRrJ8DAXL9MeOVm6OdG9BvHiztQVS3NAYR4dB7.',
  reset_token: null,
  roles: [],
  salt: '$6$k0R5arXFGDx80oUT',
  token_expires_at: null,
  two_factor_confirmed_at: null,
  two_factor_secret: null,
  username: 'etienne',
}

const mockPassportLocalStrategy = (mockedUserFound: User) => {
  // Mock user found
  prismaMock.user.findFirst.mockResolvedValue(mockedUserFound)
  // Mock revoke old tokens
  prismaMock.user_session.updateMany.mockResolvedValue({ count: 1 })
  // Mock save tokens (access+refresh)
  prismaMock.$transaction.mockResolvedValue([
    {
      id: 'tokenId1',
      token: 'token1',
      type: 'access',
      user_id: mockedUserFound.id,
    } as UserSession,
    {
      id: 'tokenId1',
      token: 'token1',
      type: 'refresh',
      user_id: mockedUserFound.id,
    } as UserSession,
  ])
}

/**
 * Mock the auth strategy, and return the access token
 */
const mockAuthStrategy = (user: User, payload: JwtTokenPayloadInput, fullyConnected: boolean) => {
  mockPassportLocalStrategy(user)

  const { accessToken } = generateJwtTokens(payload, fullyConnected)

  return accessToken
}

/**
 * **VERY IMPORTANT**: since it's a mock, you need to call this before all imported files to test
 *
 */
export const mockLoggedAsUser = (customUserInfo: OptionalUserInfo = {}, fullyConnected = false): { user: JwtTokenPayloadInput; token: string } => {
  const tokenPayload: JwtTokenPayloadInput = { ...fakeLoggedUser, ...customUserInfo, roles: ['member'] }
  const generatedUser: User = { ...fakeUserInDb, ...customUserInfo, roles: ['member'] }

  const generatedToken = mockAuthStrategy(generatedUser, tokenPayload, fullyConnected)
  return { token: generatedToken, user: tokenPayload }
}

/**
 * **VERY IMPORTANT**: since it's a mock, you need to call this before all imported files to test
 *
 */
export const mockLoggedAsAdmin = (customUserInfo: OptionalUserInfo = {}, fullyConnected = false): { user: JwtTokenPayloadInput; token: string } => {
  const tokenPayload: JwtTokenPayloadInput = { ...fakeLoggedUser, ...customUserInfo, roles: ['admin'] }
  const generatedUser: User = { ...fakeUserInDb, ...customUserInfo, roles: ['admin'] }

  const generatedToken = mockAuthStrategy(generatedUser, tokenPayload, fullyConnected)
  return { token: generatedToken, user: tokenPayload }
}

/**
 * **VERY IMPORTANT**: since it's a mock, you need to call this before all imported files to test
 *
 * Mock a user connected with 2fa way
 *
 * Sugar syntax for mockLoggedAsUser with fullyConnected = true
 */
export const mockLoggedAsFullyConnectedUser = (customUserInfo: OptionalUserInfo = {}): { user: JwtTokenPayloadInput; token: string } => mockLoggedAsUser(customUserInfo, true)

/**
 * **VERY IMPORTANT**: since it's a mock, you need to call this before all imported files to test
 *
 * Mock an admin connected with 2fa way
 *
 * Sugar syntax for mockLoggedAsAdmin with fullyConnected = true
 */
export const mockLoggedAsFullyConnectedAdmin = (customUserInfo: OptionalUserInfo = {}): { user: JwtTokenPayloadInput; token: string } => mockLoggedAsAdmin(customUserInfo, true)
