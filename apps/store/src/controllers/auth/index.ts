import jwt from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import type { user } from '@prisma/client'
import env from '../../config/env'
import { throwHTTPError, throwUnauthorizedError } from '../../common/errors'
import { createPasswordHash, passwordsMatch } from '../../common/auth/passwords'
import { genSaltSync, getHashedPassword } from '../../common/auth/sha512'
import { knex } from '../../common/db'

import {
  TOKEN_TYPE,
  generateJwtTokens,
  verifyToken,
} from '../../common/auth/jwt'

import {
  getResetPasswordToken,
  getTokenSessionModel,
  isValidSessionRefreshToken,
  loginModel,
  logoutModel,
  refreshAccessToken,
  updateResetPasswordUsingToken,
  verifyAssetPermissionModel,
} from '../../models/auth'
import type { HTTPStatus } from '../../common/constants'
import { UNAUTHORIZED } from '../../common/constants'
import { sanitizeUser } from '../../utils/user.utils'

const REFRESH_TOKEN_COOKIE_NAME = 'rt'

const createJwtProvider = () => {
  const dbProvider = {
    knex,
    logger: console,
  }
  return {
    env,
    getTokenSessionModel: (token: any, type: any) =>
      getTokenSessionModel(dbProvider, token, type),
    logger: console,
    verifyJWTToken: jwt.verify,
  }
}

export const jwtVerify = async (req: any, _res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader)
      throwUnauthorizedError({ message: 'Authorization header not found' })

    const token = authHeader.split(' ')[1]
    if (!token) {
      throwUnauthorizedError({
        message: 'Cannot parse token from Authorization header',
      })
    }

    const provider = createJwtProvider()
    const { user, error } = await verifyToken(
      provider,
      token,
      TOKEN_TYPE.access,
    )
    if (error)
      throwUnauthorizedError()

    req.user = user
    next()
  }
  catch (error) {
    next(error)
  }
}

export const loginWithPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Check auth
    return passport.authenticate('local', (error, userFromDb: false | user) => {
      // Error handler
      if (error as HTTPStatus) {
        switch (error) {
          case UNAUTHORIZED:
            return res.status(401).send({ message: 'Unauthorized' })
          // In case of non HTTPStatus error, or non-hanlded:
          default:
            return res.status(500).send({ message: 'Internal server error' })
        }
      }

      // This should not happen because it is handled above
      if (!userFromDb)
        return res.status(401).send({ message: 'Unauthorized' })

      // TODO: revoke old tokens
      // 3) Get tokens
      const { accessToken, refreshToken, user } = loginModel(userFromDb)

      // 4) Set cookie
      res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        domain: env.jwt.refresh.domain,
        httpOnly: true,
        maxAge: env.jwt.refresh.lifeInMs,
        secure: env.nodeEnv.isProduction && env.httpsEnabled,
      })

      // 5) Send response
      return res.status(201).send({ accessToken, user })
    })(req, res, next)
  }
  catch (error) {
    req.log.withError(error).error('loginWithPasswordController')
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
    const provider = createJwtProvider()
    const { user, error: jwtError } = await verifyToken(
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
