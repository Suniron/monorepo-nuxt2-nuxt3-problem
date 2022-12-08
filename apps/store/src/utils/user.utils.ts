// @ts-check
import prismaClient from '@/prismaClient'

/**
 * Returns an array of group id to which the user belongs
 *
 * @param {string} userId
 * @returns {Promise<number[]>}
 */
export const getUserGroupIds = async (userId) => {
  const groups = await prismaClient.user_group
    .findMany({
      select: {
        group_id: true,
      },
      where: {
        user_id: userId,
      },
    })
    .then((grp) => grp.map((grp) => grp.group_id))

  return groups
}
