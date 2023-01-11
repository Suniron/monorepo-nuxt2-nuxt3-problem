import type { user as User, user_session as UserSession } from '@prisma/client'
import { generateJWTToken } from '../../src/common/auth/jwt'
import type { DefaultLoggedUser, OptionalUserInfo } from '../../types/user'
import { prismaMock } from '../mockPrisma'

const fakeLoggedUser: DefaultLoggedUser = {
  aud: 'https://xrator.com',
  companyId: 1,
  companyName: 'DefaultValue',
  email: 'DefaultValue@xrator.fr',
  exp: 1647447721,
  firstName: 'DefaultValue',
  iat: 1647445921,
  id: '5dfa3005-5f8f-41f6-befe-bb1603e6dd9c',
  is2faInitialized: false,
  iss: 'https://store.xrator.com',
  lastName: 'DefaultValue',
  roles: [],
  typ: 'access',
  username: 'DefaultValued',
}

export const fakeUserInDb: User = {
  company_id: 1,
  email: 'unittest@xrator.com',
  first_name: 'Etienne',
  id: 'cfaa596f-efa7-4af1-9e37-fbf221b45f60',
  last_name: 'Blanc',
  password: '$6$k0R5arXFGDx80oUT$csmMAe7wM.qWgxgbZexiNGGmQQUPtXlgJF7V4/2pDPsd5PbCRrJ8DAXL9MeOVm6OdG9BvHiztQVS3NAYR4dB7.',
  reset_token: null,
  roles: [],
  salt: '$6$k0R5arXFGDx80oUT',
  token_expires_at: null,
  two_factor_secret: null,
  username: 'etienne',
}

const mockPassportLocalStrategy = (user: User) => {
  // Mock user found
  prismaMock.user.findFirst.mockResolvedValue(user)
  // Mock revoke old tokens
  prismaMock.user_session.updateMany.mockResolvedValue({ count: 1 })
  // Mock save tokens (access+refresh)
  prismaMock.$transaction.mockResolvedValue([
    {
      id: 'tokenId1',
      token: 'token1',
      type: 'access',
      user_id: user.id,
    } as UserSession,
    {
      id: 'tokenId1',
      token: 'token1',
      type: 'refresh',
      user_id: user.id,
    } as UserSession,
  ])
}

/**
 * Mock the auth strategy, and return the access token
 */
const mockAuthStrategy = (user: User) => {
  mockPassportLocalStrategy(user)

  const accessToken = generateJWTToken('access', {})

  return accessToken
}

export const mockLoggedAsUser = (customUserInfo: OptionalUserInfo = {}): { user: DefaultLoggedUser; token: string } => {
  const customLoggedUser: DefaultLoggedUser = { ...fakeLoggedUser, ...customUserInfo, roles: ['member'] }
  const generatedUser: User = { ...fakeUserInDb, ...customUserInfo, roles: ['member'] }

  const generatedToken = mockAuthStrategy(generatedUser)
  return { token: generatedToken, user: customLoggedUser }
}

export const mockLoggedAsAdmin = (customUserInfo: OptionalUserInfo = {}): { user: DefaultLoggedUser; token: string } => {
  const customLoggedUser: DefaultLoggedUser = { ...fakeLoggedUser, ...customUserInfo, roles: ['admin'] }
  const generatedUser: User = { ...fakeUserInDb, ...customUserInfo, roles: ['admin'] }

  const generatedToken = mockAuthStrategy(generatedUser)
  return { token: generatedToken, user: customLoggedUser }
}
