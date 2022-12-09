import jwt from 'jsonwebtoken'
import env from '../../config/env'
import { throwHTTPError, throwUnauthorizedError } from '../../common/errors'

import { UNAUTHORIZED } from '../../common/constants'

import { createPasswordHash, passwordsMatch } from '../../common/auth/passwords'

import { genSaltSync, hashSync } from '../../common/auth/sha512'

import { knex } from '../../common/db'

import { TOKEN_TYPE, generateJWTToken, verifyToken } from '../../common/auth/jwt'

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

const createLoginModelProvider = () => {
  const { access, refresh } = env.jwt

  const passMatches = (password: any, hash: any, salt: any) =>
    passwordsMatch(
      {
        hashSync,
      },
      password,
      hash,
      salt,
    )
  const generateAccessToken = (payload: any) => generateJWTToken(
    jwt.sign,
    {
      audience: access.audience,
      expiresIn: access.life,
      issuer: access.issuer,
      secret: access.secret,
      type: access.type,
    },
    payload,
  )
  const generateRefreshToken = (payload: any) => generateJWTToken(
    jwt.sign,
    {
      audience: refresh.audience,
      expiresIn: refresh.life,
      issuer: refresh.issuer,
      secret: refresh.secret,
      type: refresh.type,
    },
    payload,
  )
  return {
    TOKEN_TYPE,
    generateAccessToken,
    generateRefreshToken,
    knex,
    logger: console,
    passwordsMatch: passMatches,
  }
}

export const loginController = async (req: any, res: any, next: any) => {
  try {
    const provider = createLoginModelProvider()
    const {
      error,
      message,
      accessToken,
      refreshToken,
      userInfo,
    } = await loginModel(provider, req.body)

    if (error)
      throwHTTPError(error, message)

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      domain: env.jwt.refresh.domain,
      httpOnly: true,
      maxAge: env.jwt.refresh.lifeInMs,
      secure: env.nodeEnv.isProduction && env.httpsEnabled,
    })
    res.status(201).send({ accessToken, userInfo })
  }
  catch (error) {
    next(error)
  }
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const refreshAccessTokenController = async (req: any, res: any, next: any) => {
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

export const logoutController = async (req: any, res: any, next: any) => {
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

export const verifyAssetPermissionController = async (req: any, res: any, next: any) => {
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
      createPasswordHash: (password: any) => createPasswordHash(
        {
          genSaltSync,
          hashSync,
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
      createPasswordHash: (password: any) => createPasswordHash(
        {
          genSaltSync,
          hashSync,
        },
        password,
      ),
      knex,
      logger: console,
      passwordsMatch: (password: any, hash: any, salt: any) =>
        passwordsMatch(
          {
            hashSync,
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

export const isAuthorizedController = async (req: any, res: any, next: any) => {
  try {
    res.status(201).send({ isAuthorized: true })
  }
  catch (error) {
    next(error)
  }
}
