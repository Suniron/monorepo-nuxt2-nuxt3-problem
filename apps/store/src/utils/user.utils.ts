import type { user as User } from '@prisma/client'
import type { UserRole } from '../../types/user'

import prismaClient from './../prismaClient'

export interface SanitizedUser {
  id: string
  companyId: number
  email: string
  username: string
  firstName: string
  lastName: string
  roles: UserRole[]
}

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
export const sanitizeUser = (user: User): SanitizedUser => {
  return {
    companyId: user.company_id as number,
    email: user.email as string,
    firstName: user.first_name as string,
    id: user.id as string,
    lastName: user.last_name as string,
    roles: user.roles as UserRole[],
    username: user.username as string,
  }
}
