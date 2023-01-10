import type { user as User } from '@prisma/client'
import type { DefaultLoggedUser, OptionalUserInfo } from '../../types/user'

export const fakeLoggedUser: DefaultLoggedUser = {
  aud: 'https://xrator.com',
  companyId: 1,
  companyName: 'DefaultValue',
  email: 'DefaultValue@xrator.fr',
  exp: 1647447721,
  firstName: 'DefaultValue',
  iat: 1647445921,
  id: '5dfa3005-5f8f-41f6-befe-bb1603e6dd9c',
  iss: 'https://store.xrator.com',
  lastName: 'DefaultValue',
  roles: [
    'admin',
  ],
  typ: 'access',
  username: 'DefaultValued',
}

export const fakeUser: User = {
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
  username: 'etienne',
}

export const generateUser = (userInfo: OptionalUserInfo = {}): DefaultLoggedUser => Object.assign({}, fakeLoggedUser, userInfo)

/**
 * Get an xrator app admin user
 *
 * You can overload all its information **except roles**.
 *
 */
export const getAdminUser = (userInfos: OptionalUserInfo = {}) =>
  Object.assign({}, fakeLoggedUser, { ...userInfos, roles: ['admin'] })

/**
 * Get an xrator app non admin user
 *
 * You can overload all its information **except roles**.
 *
 */
export const getNonAdminUser = (userInfos: OptionalUserInfo = {}) =>
  Object.assign({}, fakeLoggedUser, { ...userInfos, roles: ['member'] })
