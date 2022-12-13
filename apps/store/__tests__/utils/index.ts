import * as userData from '../example-values/user.json'

import * as loginData from '../example-values/login.json'

/**
 * @param {import('@/types/user').OptionnalUserInfos} item
 * @returns {import('@/types/user').LoggedUser}
 */
export const generateUser = (item = {}) => Object.assign({}, userData, item)

/**
 * Get an xrator app admin user
 *
 * You can overload all its information **except roles**.
 *
 * @param {import('@/types/user').OptionnalUserInfos?} userInfos
 */
export const getAdminUser = (userInfos: any) =>
  Object.assign({}, userData, { ...userInfos, roles: ['admin'] })

/**
 * Get an xrator app non admin user
 *
 * You can overload all its information **except roles**.
 *
 * @param {import('@/types/user').OptionnalUserInfos?} userInfos
 */
export const getNonAdminUser = (userInfos: any) =>
  Object.assign({}, userData, { ...userInfos, roles: ['member'] })

/**
 * @param {import('@/types/user').OptionnalUserInfos} item
 * @returns {import('@/types/user').LoggedUser}
 */
export function generateLogin(item = {}) {
  return Object.assign({}, loginData, item)
}
