import type { user as User } from '@prisma/client'

import prismaClient from './../prismaClient'

/**
 * Returns an array of group id to which the user belongs
 *
 * @param {string} userId
 * @returns {Promise<number[]>}
 */
export const getUserGroupIds = async (userId: any) => {
  const groups = await prismaClient.user_group
    .findMany({
      select: {
        group_id: true,
      },
      where: {
        user_id: userId,
      },
    })
    .then((grp: any) => grp.map((grp: any) => grp.group_id))

  return groups
}

/**
 * It will return the user object with sanitized data (no password, no salt, ...)
 */
export const sanitizeUser = (user: User): Partial<User> => {
  return {
    company_id: user.company_id,
    email: user.email,
    first_name: user.first_name,
    id: user.id,
    last_name: user.last_name,
    roles: user.roles,
    username: user.username,
  }
}
