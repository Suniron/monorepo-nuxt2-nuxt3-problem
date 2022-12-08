// @ts-check
import {
  FORBIDDEN,
  MODEL_ERROR,
  NOT_FOUND,
  SUCCESS,
  UNAUTHORIZED,
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
} from '@/common/constants'
// @ts-expect-error TS(2307): Cannot find module '@/common/db' or its correspond... Remove this comment to see the full error message
import { knex } from '@/common/db'
// @ts-expect-error TS(2307): Cannot find module '@/prismaClient' or its corresp... Remove this comment to see the full error message
import prismaClient from '@/prismaClient'

/**
 * @param {any} params
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 */
export const searchGroupsModel = async (params: any, loggedUserInfo: any) => {
  const { companyId } = loggedUserInfo
  const { id, sort = 'name' } = params

  // TODO: check if id is number

  try {
    const groups = await prismaClient.group.findMany({
      select: {
        id: true,
        name: true,
        user_group: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
      where: {
        company_id: companyId,
        // If "id" is undefined, it will fetch all groups in the company:
        id: id && Number(id),
        user_group: {
          // If non admin, get only groups where user is member:
          some: !loggedUserInfo.roles.includes('admin')
            ? {
                user_id: loggedUserInfo.id,
              }
            : // Else, ignore this filter in admin
              undefined,
        },
      },
      // If no "sort" (or different from "name"), it will no sort:
      orderBy: { name: sort === 'name' ? 'asc' : undefined },
    })

    // Rewrite result to match with current API usage ("user_groups" is used as "members" for example)
    const restructuredGroups = groups.map((group: any) => {
      const restructuredGroup = {
        ...group,
        members: group.user_group.map((u: any) => u.user),
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      delete restructuredGroup.user_group
      return restructuredGroup
    })

    // If single group search:
    if (id) {
      if (!restructuredGroups.length) {
        return { error: NOT_FOUND }
      }

      return { group: restructuredGroups[0] }
    }

    // If multiple groups search:
    return { groups: restructuredGroups, total: restructuredGroups.length }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

export const createGroupModel = async (params: any, loggedUserInfo = {}) => {
  try {
    const { name, memberIds } = params
    // @ts-expect-error TS(2339): Property 'companyId' does not exist on type '{}'.
    const { companyId } = loggedUserInfo

    const { id } = await knex.transaction(async (trx: any) => {
      const [{ id }] = await trx('group')
        .insert({ name, company_id: companyId })
        .returning('id')

      if (memberIds.length) {
        await trx('user_group').insert(
          memberIds.map((mId: any) => ({
            user_id: mId,
            group_id: id
          }))
        )
      }

      return { id }
    })

    return { id }
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {{id: string, memberIds?: string[], name?: string}} params
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 * @returns {Promise<{error?:string, message?:
 * string}>}
 */
export const updateGroupModel = async (
  {
    id,
    memberIds,
    name
  }: any,
  loggedUserInfo: any
) => {
  // TODO: Check if id is a number
  const groupId = Number(id)

  if (!loggedUserInfo.roles.includes('admin')) {
    return { error: FORBIDDEN, message: 'Logged user is not admin' }
  }

  try {
    // First, check if group exist:
    const { error } = await searchGroupsModel({ id: groupId }, loggedUserInfo)
    if (error) {
      return { error }
    }

    // If change group name:
    if (name) {
      await prismaClient.group.update({
        data: { name },
        where: { id: groupId },
      })
    }

    // If change group members:
    if (memberIds) {
      const updateGroupMembersTransactions = []
      // Step 1: remove all user from this group:
      updateGroupMembersTransactions.push(
        prismaClient.user_group.deleteMany({
          where: { group_id: groupId },
        })
      )

      // Step 2: add all given member ids to this group:
      if (memberIds.length) {
        updateGroupMembersTransactions.push(
          prismaClient.user_group.createMany({
            data: memberIds.map((mId: any) => ({
              user_id: mId,
              group_id: groupId
            })),
          })
        )
      }

      await prismaClient.$transaction(updateGroupMembersTransactions)
    }

    return await searchGroupsModel({ id: groupId }, loggedUserInfo)
  } catch (error) {
    console.error(error)
    return { error: MODEL_ERROR }
  }
}
export const deleteGroupModel = async (provider: any, id: any, loggedUserInfo: any) => {
  const { knex, logger } = provider
  try {
    if (loggedUserInfo.roles.includes('admin')) {
      await knex('group').where('id', id).delete()
      return { status: SUCCESS }
    }
    return { error: UNAUTHORIZED }
  } catch (error) {
    logger.error(error)
    return { error: MODEL_ERROR }
  }
}
