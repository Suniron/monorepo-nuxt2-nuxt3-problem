import jwt from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import type { user as User } from '@prisma/client'
import { HTTPS_ENABLED, JWT_REFRESH_DOMAIN, JWT_REFRESH_LIFE_MS, REFRESH_TOKEN_COOKIE_NAME, isProduction } from '../../config/env'
import { throwHTTPError, throwUnauthorizedError } from '../../common/errors'
import { createPasswordHash, passwordsMatch } from '../../common/auth/passwords'
import { genSaltSync, getHashedPassword } from '../../common/auth/sha512'
import { knex } from '../../common/db'

import {
  TOKEN_TYPE,
  verifyTokenOld,
} from '../../common/auth/jwt'

import {
  getResetPasswordToken,
  getTokenSessionModel,
  initTokensModel,
  isValidSessionRefreshToken,
  logoutModel,
  refreshAccessToken,
  updateResetPasswordUsingToken,
  verifyAssetPermissionModel,
} from '../../models/auth'
import type { HTTPStatus } from '../../common/constants'
import { UNAUTHORIZED } from '../../common/constants'

const createJwtProviderOld = () => {
  const dbProvider = {
    knex,
    logger: console,
  }
  return {
    env: 'TODO: TO REMOVE',
    getTokenSessionModel: (token: any, type: any) =>
      getTokenSessionModel(dbProvider, token, type),
    logger: console,
    verifyJWTToken: jwt.verify,
  }
}

/**
 * On success, the user is not fully connected. He needs to authenticate with a 2FA way.
 *
 * A limited access token is returned in the response and a refresh token is set in a cookie.
 */
export const loginWithCredentialsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Check auth
    return passport.authenticate('local', async (error, userFromDb: false | User & { company: { name: string } }) => {
      // Error handler
      if (error as HTTPStatus) {
        switch (error) {
          case UNAUTHORIZED:
            return res.status(401).send({ message: 'Unauthorized' })
          // In case of non HTTPStatus error, or non-handled:
          default:
            return res.status(500).send({ message: 'Internal server error' })
        }
      }

      // This should not happen because it is handled above
      if (!userFromDb)
        return res.status(401).send({ message: 'Unauthorized' })
      // 2) Get tokens
      const { accessToken, refreshToken, user, error: initTokensError } = await initTokensModel(userFromDb)
      if (initTokensError) {
        // TODO: handle different error
        return res.status(500).send()
      }
      // 3) Set cookie
      res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        domain: JWT_REFRESH_DOMAIN,
        httpOnly: true,
        maxAge: JWT_REFRESH_LIFE_MS,
        secure: isProduction && HTTPS_ENABLED,
      })

      // 4) Send response
      return res.status(201).send({ accessToken, is2faInitialized: !!userFromDb.two_factor_secret, user })
    })(req, res, next)
  }
  catch (error) {
    req.log.withError(error).error('loginWithCredentialsController')
    next(error)
  }
}

export const refreshAccessTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /**
     * @type {string | undefined}
     */
    const refreshToken = req.cookies.rt

    if (!refreshToken || refreshToken === 'undefined') {
      throwUnauthorizedError({ message: 'Refresh token not found' })
      return
    }

    // Check token validity:
    const provider = createJwtProviderOld()
    const { user, error: jwtError } = await verifyTokenOld(
      provider,
      refreshToken,
      TOKEN_TYPE.refresh,
    )
    if (jwtError || !user || !user.id) {
      throwUnauthorizedError()
      return
    }

    // Check existing session refresh token:
    if (!(await isValidSessionRefreshToken(refreshToken, user.id))) {
      throwUnauthorizedError()
      return
    }

    const {
      error: refreshAccessTokenError,
      accessToken,
      user: freshUser,
    } = await refreshAccessToken(user.id)
    if (refreshAccessTokenError) {
      throwUnauthorizedError()
      return
    }

    res.status(201).send({ accessToken, user: freshUser })
  }
  catch (error) {
    next(error)
  }
}

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const provider = {
      knex,
      logger: console,
    }
    const { error } = await logoutModel(provider, req.user)
    if (error)
      throwHTTPError(error)

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)
    res.status(204).end()
  }
  catch (error) {
    next(error)
  }
}

export const verifyAssetPermissionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { error, status } = await verifyAssetPermissionModel(
      req.user,
      req.params?.id || undefined,
      req.body?.assets || undefined,
      req.params?.relId || undefined,
      req.params?.scanId || undefined,
      req.params?.cartoId || undefined,
    )
    if (error)
      next(error)
    else if (status === UNAUTHORIZED)
      res.sendStatus(401)
    else next()
  }
  catch (error) {
    next(error)
  }
}
export const sendResetMailPassword = async (req: any, res: any) => {
  if (!req.body.username) {
    res.sendStatus(401)
  }
  else {
    const dbProvider = {
      createPasswordHash: (password: any) =>
        createPasswordHash(
          {
            genSaltSync,
            hashSync: getHashedPassword,
          },
          password,
        ),
      knex,
      logger: console,
    }
    const response = await getResetPasswordToken(dbProvider, req.body)
    res.send(response)
  }
}
export const updateResetPasswordByToken = async (req: any, res: any) => {
  if (!req.body.password || !req.body.token) {
    res.sendStatus(401)
  }
  else {
    const dbProvider = {
      createPasswordHash: (password: any) =>
        createPasswordHash(
          {
            genSaltSync,
            hashSync: getHashedPassword,
          },
          password,
        ),
      knex,
      logger: console,
      passwordsMatch: (password: any, hash: any, salt: any) =>
        passwordsMatch(
          {
            hashSync: getHashedPassword,
          },
          password,
          hash,
          salt,
        ),
    }
    const { error } = await updateResetPasswordUsingToken(dbProvider, req.body)
    if (error)
      res.sendStatus(404)
    else res.sendStatus(200)
  }
}

export const isAuthorizedController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).send({ isAuthorized: true })
  }
  catch (error) {
    next(error)
  }
}
