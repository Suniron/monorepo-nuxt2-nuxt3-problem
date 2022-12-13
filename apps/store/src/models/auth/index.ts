import crypto from 'crypto'
import { generateAccessToken } from '../../common/auth/jwt'
import {
  FORBIDDEN,
  MODEL_ERROR,
  NOT_FOUND,
  SUCCESS,
  UNAUTHORIZED,
  VALIDATION_ERROR,
} from '../../common/constants'

import { knex } from '../../common/db'

import { log } from '../../lib/logger'

import prismaClient from '../../prismaClient'

export const getTokenSessionModel = async (
  provider: any,
  token: any,
  type: any,
) => {
  const { knex, logger } = provider

  try {
    const [session] = await knex('user_session')
      .where({ token, type })
      .whereNull('deleted_at')

    if (!session) {
      logger.error(new Error('JWT token not found'))
      return { error: NOT_FOUND }
    }

    return { session }
  }
  catch (error) {
    logger.error(error)
    return { error: MODEL_ERROR }
  }
}
/**
 *
 * @param {*} provider
 * @param {*} params
 * @returns {Promise<{error?: string, message?: string, accessToken?: string, refreshToken?: string, userInfo?: import('@/types/user').LoggedUser}>}
 */
export const loginModel = async (provider: any, params: any) => {
  const {
    knex,
    logger,
    passwordsMatch,
    generateAccessToken,
    generateRefreshToken,
    TOKEN_TYPE,
  } = provider
  try {
    const { username, password } = params
    if (!password) {
      logger.error(new Error('Password param required'))
      return { error: VALIDATION_ERROR }
    }
    if (!username) {
      logger.error(new Error('Username param required'))
      return { error: VALIDATION_ERROR }
    }

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
        'cmp.name as company_name',
        'usr.roles',
      )
      .from('user as usr')
      .innerJoin('company as cmp', 'usr.company_id', 'cmp.id')
      .where(function (this: any) {
        this.where('usr.username', username).orWhere('usr.email', username)
      })
    if (!user) {
      return {
        error: NOT_FOUND,
        message: `User with username or email "${username}" not found`,
      }
    }
    const isCorrectPass = passwordsMatch(password, user.password, user.salt)
    if (!isCorrectPass)
      return { error: UNAUTHORIZED, message: 'Incorrect password' }

    // Proceed to create new session
    const { accessToken, refreshToken, userInfo } = await knex.transaction(
      async (trx: any) => {
        // Kill any existing session
        await trx('user_session')
          .where('user_id', user.id)
          .whereNull('deleted_at')
          .update({ deleted_at: new Date(Date.now()) })

        const userInfo = {
          companyId: user.company_id,
          companyName: user.company_name,
          email: user.email,
          firstName: user.first_name,
          id: user.id,
          lastName: user.last_name,
          roles: user.roles,
          username: user.username,
        }
        const accessToken = generateAccessToken(userInfo)
        const refreshToken = generateRefreshToken({
          id: user.id,
        })

        await trx('user_session').insert([
          {
            token: refreshToken,
            type: TOKEN_TYPE.refresh,
            user_id: user.id,
          },
          {
            token: accessToken,
            type: TOKEN_TYPE.access,
            user_id: user.id,
          },
        ])
        return { accessToken, refreshToken, userInfo }
      },
    )
    return { accessToken, refreshToken, userInfo }
  }
  catch (error) {
    logger.error('[model>auth>index.js>loginModel()] error:', error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {import("@prisma/client").user_session["token"]} refreshToken
 * @param {import("@prisma/client").user_session["user_id"]} userId
 */
export const isValidSessionRefreshToken = async (
  refreshToken: any,
  userId: any,
) => {
  try {
    const sessionFound = await prismaClient.user_session.findFirst({
      where: {
        deleted_at: null,
        token: refreshToken,
        type: 'refresh',
        user_id: userId,
      },
    })

    return !!sessionFound
  }
  catch (error) {
    log.withError(error).error('isValidSessionRefreshToken')
    return false
  }
}

/**
 *
 * @param {import("@prisma/client").user["id"]} userId
 */
export const refreshAccessToken = async (userId: any) => {
  try {
    const { accessToken, user } = await prismaClient.$transaction(
      async (tx: any) => {
        // 1) Retrieve user info
        const user = await tx.user.findFirst({
          select: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
            email: true,
            first_name: true,
            id: true,
            last_name: true,
            roles: true,
            user_group: { select: { group_id: true } },
            username: true,
          },
          where: {
            id: userId,
          },
        })

        if (!user)
          throw new Error('User not found')
        else if (!user.company)
          throw new Error('Company not found')

        const formattedUser = {
          companyId: user.company.id,
          companyName: user.company.name,
          email: user.email,
          firstName: user.first_name,
          groups: user.user_group.map((ug: any) => ug.group_id),
          id: user.id,
          lastName: user.last_name,
          roles: user.roles,
          username: user.username,
        }

        // 2) Disable any existing session
        await tx.user_session.updateMany({
          data: {
            deleted_at: new Date(),
          },
          where: {
            deleted_at: null,
            type: 'access',
            user_id: userId,
          },
        })

        // 3) Generate new access token and insert in database
        const generatedAccessToken = generateAccessToken(formattedUser)
        const { token } = await tx.user_session.create({
          data: {
            token: generatedAccessToken,
            type: 'access',
            user_id: userId,
          },
        })

        return { accessToken: token, user: formattedUser }
      },
    )
    return { accessToken, user }
  }
  catch (error) {
    log.withError(error).error('[model>auth>index.js>refreshAccessToken()]')
    return { error: MODEL_ERROR }
  }
}

export const logoutModel = async (provider: any, userInfo: any) => {
  const { logger, knex } = provider
  try {
    if (!userInfo.id) {
      logger.error(new Error('User id required to delete sessions'))
      return { error: MODEL_ERROR }
    }

    await knex('user_session')
      .where('user_id', userInfo.id)
      .whereNull('deleted_at')
      .update({
        deleted_at: new Date(Date.now()),
      })

    return { status: SUCCESS }
  }
  catch (error) {
    logger.withError(error).error(error)
    return { error: MODEL_ERROR }
  }
}

/**
 *
 * @param {*} loggedUserInfo
 * @param {string} assetId
 * @param {*} assets
 * @param {*} relId
 * @param {*} scanId
 * @param {*} cartoId
 * @returns {Promise<{error?: string, status?: import("src/common/constants").HTTPStatus} | void>}
 */
export const verifyAssetPermissionModel = async (
  loggedUserInfo = {},
  assetId = '',
  assets = undefined,
  relId = null,
  scanId = null,
  cartoId = null,
) => {
  try {
    const { companyId, groups, roles } = loggedUserInfo
    if (
      roles.includes('admin')
      || (isNaN(parseInt(assetId)) && assets === undefined)
      || !relId
      || !scanId
      || !cartoId
    )
      return { status: SUCCESS }

    const query = knex
      .select()
      .from('asset as ast')
      .innerJoin('group_asset as gast', 'gast.asset_id', 'id')
      .where({ company_id: companyId })
      .whereIn('gast.group_id', groups)

    if (assetId) {
      const [assetExist] = await query.where({ 'ast.id': assetId })
      if (assetExist)
        return { status: SUCCESS }
      else return { status: UNAUTHORIZED }
    }
    else if (assets) {
      const assetsExist = await query.whereIn({ 'ast.id': assets })

      if (assetsExist.length === assets.length)
        return { status: SUCCESS }
      else return { status: UNAUTHORIZED }
    }
    else if (relId) {
      const [relationExist] = await knex
        .select('rel.id')
        .from('relation as rel')
        .innerJoin('asset as ast_from', 'ast_from.id', 'rel.from_asset_id')
        .innerJoin('company as cp_from', 'cp_from.id', 'ast_from.company_id')
        .innerJoin('asset as ast_to', 'ast_to.id', 'rel.to_asset_id')
        .innerJoin('company as cp_to', 'vp_to.id', 'ast_to.company_id')
        .where({ 'cp_from.id': companyId, 'cp_to': companyId, 'rel.id': relId })
      if (!relationExist)
        return { status: UNAUTHORIZED }
      // TODO: missing return case here
    }
    else if (scanId) {
      const [scanExist] = await knex
        .select('scan.id')
        .from('scan')
        .innerJoin('company as cp', 'cp.id', 'scan.company_id')
        .where({ 'cp.id': companyId, 'scan.id': scanId })
      if (!scanExist)
        return { status: UNAUTHORIZED }
      // TODO: missing return case here
    }
    else if (cartoId) {
      const [cartoExist] = await knex
        .select('cy.id')
        .from('cartography as cy')
        .where({ 'cy.company_id': companyId, 'cy.id': cartoId })
      if (!cartoExist)
        return { status: UNAUTHORIZED }
      // TODO: missing return case here
    }
  }
  catch (error) {
    log.withError(error).error('verifyAssetPermissionModel')
    return { error }
  }
}

export const getResetPasswordToken = async (provider: any, params: any) => {
  const { knex } = provider
  try {
    const { username } = params
    const [user] = await knex
      .select('usr.id', 'usr.email')
      .from('user as usr')
      .where(function (this: any) {
        this.where('usr.username', username).orWhere('usr.email', username)
      })
    if (user) {
      const randomFiftySymbols = crypto
        .randomBytes(25)
        .toString('hex')
        .slice(0, 140)
      await knex('user')
        .where('id', user.id)
        .update({
          reset_token: randomFiftySymbols,
          token_expires_at: Date.now() + 3600 * 1000,
        })
      user.resetToken = randomFiftySymbols
      return user
    }
    else {
      return { error: NOT_FOUND }
    }
  }
  catch (error) {
    log.withError(error).error('getResetPasswordToken')
    return { error: MODEL_ERROR }
  }
}
export const updateResetPasswordUsingToken = async (
  provider: any,
  params: any,
) => {
  const { knex, logger, createPasswordHash } = provider
  try {
    const { password, token } = params
    if (token === null)
      return { error: FORBIDDEN }

    const [user] = await knex
      .select('usr.id', 'usr.reset_token', 'usr.token_expires_at')
      .from('user as usr')
      .where(function (this: any) {
        this.where('usr.reset_token', token)
      })
    if (user) {
      if (Date.now() > user.token_expires_at)
        return { error: FORBIDDEN }
      const { hash, salt } = createPasswordHash(password)
      await knex('user').where('id', user.id).update({
        password: hash,
        reset_token: null,
        salt,
        token_expires_at: null,
      })
      user.reset_token = null
      return { status: SUCCESS }
    }
    else {
      return { error: NOT_FOUND }
    }
  }
  catch (error) {
    logger.error(error)
    return { error: MODEL_ERROR }
  }
}
