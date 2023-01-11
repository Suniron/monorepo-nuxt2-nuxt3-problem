import {
  DUPLICATE,
  FORBIDDEN,
  MODEL_ERROR,
  NOT_FOUND,
  SUCCESS,
  UNAUTHORIZED,
} from '../../../src/common/constants'

import prismaClient from '../../../src/prismaClient'
import type { LoggedUser } from '../../../types/user'
import { getHashedPassword } from '../../common/auth/sha512'
import { log } from '../../lib/logger'
import { getUserByIdRequest } from '../../requests/users'

/**
 *
 * @param {*} provider
 * @param {*} params
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 * @returns
 */
export const searchUsersModel = async (
  provider: any,
  params: any,
  loggedUserInfo: any,
) => {
  const { logger } = provider
  try {
    const { companyId } = loggedUserInfo
    const { id, sort = 'name', username, email } = params

    if (!companyId) {
      logger.error(new Error('No company id'))
      return { error: MODEL_ERROR }
    }

    /**
     * @type {number[]|undefined}
     */
    let groupsToFilter
    // If non admin, restrict to fetch users only in logged user group(s)
    if (!loggedUserInfo.roles.includes('admin')) {
      groupsToFilter = (
        await prismaClient.group.findMany({
          select: { id: true },
          where: { user_group: { some: { user_id: loggedUserInfo.id } } },
        })
      ).map((g: any) => g.id)
    }

    const users = await prismaClient.user.findMany({
      // If no "sort" (or different from "first_name"), it will no sort:
      orderBy: { first_name: sort === 'name' ? 'asc' : undefined },

      select: {
        email: true,
        first_name: true,
        id: true,
        last_name: true,
        roles: true,
        user_group: { select: { group: { select: { id: true, name: true } } } },
        username: true,
      },

      where: {
        company_id: loggedUserInfo.companyId,
        // where username if not undefined
        email,
        // where email if not undefined
        id,
        // where user id if not undefined
        // If non-admin, search only in user group(s):
        user_group: groupsToFilter && {
          some: { group_id: { in: groupsToFilter } },
        },

        username,
      },
    })

    // Reformat data because current API is used like that:
    const restructuredUsers = users.map((u: any) => {
      /**
       * @type {{id: string, username: string|null, first_name: string|null, last_name: string|null, email: string|null, roles: string[], user_group?: {group: {id: number, name: string|null}}[], groups: {id: number, name: string|null}[]}}
       */
      const formattedUser = {
        ...u,
        groups: u.user_group.map((ug: any) => ug.group),
      }
      delete formattedUser.user_group
      return formattedUser
    })

    // If no result, return NOT_FOUND
    if (!restructuredUsers.length)
      return { error: NOT_FOUND }

    // If search only one user:
    if (id)
      return { user: restructuredUsers[0] }

    // Else, if search multiple users:
    return { total: restructuredUsers.length, users: restructuredUsers }
  }
  catch (error) {
    logger.error(error)

    return { error: MODEL_ERROR }
  }
}

/**
 * Creates a new user in DB
 *
 * @param {object} provider Services provider
 * @param {object} params Params to create a user
 * @param {object} loggedUserInfo Info of logged in user retrieved from JWT access token
 * @returns
 */
export const createUser = async (
  provider: any,
  params: any,
  loggedUserInfo = {},
) => {
  const { knex, logger, createPasswordHash } = provider
  try {
    const {
      firstName,
      lastName,
      username,
      password,
      email,
      roles = ['member'],
    } = params

    const { companyId, roles: loggedUserRoles } = loggedUserInfo

    if (
      !companyId
      || !Array.isArray(loggedUserRoles)
      || !loggedUserRoles.includes('admin')
    ) {
      logger.error(
        new Error(
          'Logged in user does not have privileges to create a new user',
        ),
      )
      return { error: FORBIDDEN }
    }

    // First check if username already exist withing company
    const [user] = await knex
      .select('u.id')
      .from('user as u')
      .innerJoin('company as cp', 'u.company_id', 'cp.id')
      .where('cp.id', companyId)
      .where('u.username', username)
    if (user) {
      logger.error(new Error('Username already exists in company'))
      return { error: DUPLICATE.USERNAME }
    }

    // Proceed to create user in DB
    const { hash, salt } = createPasswordHash(password)

    const [userId] = (
      await knex('user')
        .insert({
          // For now, only admin users can add other user to their OWN COMPANY
          company_id: companyId,
          email,
          first_name: firstName,
          last_name: lastName,
          password: hash,
          roles,
          salt,
          username,
        })
        .returning('id')
    ).map((e: any) => e.id)

    return { id: userId }
  }
  catch (error) {
    logger.error(error)

    const { constraint } = error
    if (constraint === 'user_email_key')
      return { error: DUPLICATE.MAIL }

    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {*} provider
 * @param {*} params
 * @param {import('@/types/user').LoggedUser} loggedUserInfo
 * @returns {Promise<{error?: string, message?: string}>}
 */
export const updateUserModel = async (
  provider: any,
  params: {
    id: string
    email: string
    username: string
    roles: string[]
    groupIds: string
    firstName: string
    lastName: string
    oldPassword: string
    password1: string
    password2: string
  },
  loggedUserInfo: LoggedUser,
): Promise<{ error?: string; message?: string }> => {
  const { knex, logger, createPasswordHash, passwordsMatch } = provider
  try {
    const {
      id,
      email,
      username,
      roles,
      groupIds,
      firstName,
      lastName,
      oldPassword,
      password1,
      password2,
    } = params

    // First check if user exists in company
    const [user] = await knex
      .select(
        'usr.id',
        'usr.first_name',
        'usr.last_name',
        'usr.username',
        'usr.password',
        'usr.salt',
        'usr.email',
        'usr.company_id',
        'usr.roles',
      )
      .from('user as usr')
      .where('usr.id', id)
    if (!user) {
      logger.error(UNAUTHORIZED)
      return { error: UNAUTHORIZED }
    }
    if (!loggedUserInfo.roles.includes('admin') && loggedUserInfo.id !== id)
      return { error: UNAUTHORIZED }
    if (oldPassword) {
      const isCorrectPass = passwordsMatch(
        {
          hashSync: getHashedPassword,
        },
        oldPassword,
        user.password,
        user.salt,
      )
      if (!isCorrectPass)
        return { error: UNAUTHORIZED, message: 'Incorrect password' }
    }
    await knex.transaction(async (trx: any) => {
      if (roles) {
        let rolesTmp = roles
        if (!loggedUserInfo.roles.includes('admin'))
          rolesTmp = roles.filter((e: any) => e !== 'admin')
        await trx('user')
          .where('id', id)
          .update({ roles: rolesTmp.map((r: any) => r.toLowerCase()) })
      }

      if (groupIds) {
        // First delete all user groups
        await trx('user_group').where('user_id', id).delete()

        // This check prevents an error when no group is selected
        if (groupIds.length > 0) {
          // Then repopulate with new groups
          await trx('user_group').insert(
            groupIds.map((gId: any) => ({
              group_id: gId,
              user_id: id,
            })),
          )
        }
      }
      if (
        (oldPassword || loggedUserInfo.roles.includes('admin'))
        && password1 === password2
        && password1
      ) {
        const { hash, salt } = createPasswordHash(password1)
        await trx('user').where('id', id).update({
          email,
          first_name: firstName,
          last_name: lastName,
          password: hash,
          salt,
          username,
        })
      }
      else if (email || username || firstName || lastName) {
        await trx('user').where('id', id).update({
          email,
          first_name: firstName,
          last_name: lastName,
          username,
        })
      }
    })
    return await searchUsersModel(provider, { id }, loggedUserInfo)
  }
  catch (error) {
    logger.error(error)

    return { error: MODEL_ERROR }
  }
}

export const deleteUserModel = async (
  provider: any,
  id: any,
  loggedUserInfo = {},
) => {
  const { knex, logger } = provider
  try {
    if (loggedUserInfo.roles.includes('admin')) {
      await knex('user').where('id', id).delete()
      return { status: SUCCESS }
    }
    return { error: UNAUTHORIZED }
  }
  catch (error) {
    logger.error(error)

    return { error: MODEL_ERROR }
  }
}

/**
 * **Important note**: the returned user object will contain the password and salt fields
 */
export const getUserByEmailOrUsername = async (userLogin: string) => {
  try {
    const user = await prismaClient.user.findFirst({
      where: {
        OR: [{ username: userLogin }, { email: userLogin }],
      },
    })

    return { user }
  }
  catch (error) {
    log.withError(error).error('getUserByEmailOrUsername: Error getting user by email')
    return { error: MODEL_ERROR }
  }
}

export const is2faInitialized = async (userId: string) => {
  try {
    const user = await getUserByIdRequest(prismaClient, userId)

    if (!user)
      return { error: UNAUTHORIZED }

    // If 2FA bypass is enable (for developers for example)
    if (!user.is_two_factor_required)
      return { isInitialized: true }

    return { isInitialized: !!user.two_factor_secret && !!user.two_factor_confirmed_at }
  }
  catch (error) {
    log.withError(error).error('is2faInitialized')
    return { error: MODEL_ERROR }
  }
}
