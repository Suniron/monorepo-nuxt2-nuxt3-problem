// @ts-check
// @ts-expect-error TS(2307): Cannot find module '@/common/errors' or its corres... Remove this comment to see the full error message
import { throwHTTPError, throwUnauthorizedError } from '@/common/errors'
// @ts-expect-error TS(2307): Cannot find module '@/common/constants' or its cor... Remove this comment to see the full error message
import { UNAUTHORIZED } from '@/common/constants'
// @ts-expect-error TS(2307): Cannot find module '@/common/auth/passwords' or it... Remove this comment to see the full error message
import { passwordsMatch } from '@/common/auth/passwords'

// @ts-expect-error TS(2307): Cannot find module '@/common/auth/sha512' or its c... Remove this comment to see the full error message
import { hashSync, genSaltSync } from '@/common/auth/sha512'
// @ts-expect-error TS(2307): Cannot find module '@/common/auth/passwords' or it... Remove this comment to see the full error message
import { createPasswordHash } from '@/common/auth/passwords'
// @ts-expect-error TS(2307): Cannot find module '@/common/db' or its correspond... Remove this comment to see the full error message
import { knex } from '@/common/db'
// @ts-expect-error TS(2307): Cannot find module '@/common/auth/jwt' or its corr... Remove this comment to see the full error message
import { generateJWTToken, verifyToken, TOKEN_TYPE } from '@/common/auth/jwt'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'json... Remove this comment to see the full error message
import jwt from 'jsonwebtoken'
// @ts-expect-error TS(2307): Cannot find module '@/config/env' or its correspon... Remove this comment to see the full error message
import env from '@/config/env'
import {
  loginModel,
  getTokenSessionModel,
  logoutModel,
  verifyAssetPermissionModel,
  getResetPasswordToken,
  updateResetPasswordUsingToken,
  isValidSessionRefreshToken,
  refreshAccessToken,
// @ts-expect-error TS(2307): Cannot find module '@/models/auth' or its correspo... Remove this comment to see the full error message
} from '@/models/auth'

const REFRESH_TOKEN_COOKIE_NAME = 'rt'

const createJwtProvider = () => {
  const dbProvider = {
    knex,
    logger: console,
  }
  return {
    verifyJWTToken: jwt.verify,
    env,
    logger: console,
    getTokenSessionModel: (token: any, type: any) =>
      getTokenSessionModel(dbProvider, token, type),
  };
}

export const jwtVerify = async (req: any, _res: any, next: any) => {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      throwUnauthorizedError({ message: 'Authorization header not found' })
    }

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
      TOKEN_TYPE.access
    )
    if (error) throwUnauthorizedError()

    req.user = user
    next()
  } catch (error) {
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
      salt
    )
  const generateAccessToken = (payload: any) => generateJWTToken(
    jwt.sign,
    {
      secret: access.secret,
      expiresIn: access.life,
      audience: access.audience,
      issuer: access.issuer,
      type: access.type,
    },
    payload
  )
  const generateRefreshToken = (payload: any) => generateJWTToken(
    jwt.sign,
    {
      secret: refresh.secret,
      expiresIn: refresh.life,
      audience: refresh.audience,
      issuer: refresh.issuer,
      type: refresh.type,
    },
    payload
  )
  return {
    knex,
    logger: console,
    passwordsMatch: passMatches,
    generateAccessToken,
    generateRefreshToken,
    TOKEN_TYPE,
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

    if (error) throwHTTPError(error, message)

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      domain: env.jwt.refresh.domain,
      httpOnly: true,
      secure: env.nodeEnv.isProduction && env.httpsEnabled,
      maxAge: env.jwt.refresh.lifeInMs,
    })
    res.status(201).send({ accessToken, userInfo })
  } catch (error) {
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
      TOKEN_TYPE.refresh
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
  } catch (error) {
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
    if (error) throwHTTPError(error)

    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)
    res.status(204).end()
  } catch (error) {
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
      req.params?.cartoId || undefined
    )
    if (error) next(error)
    else if (status === UNAUTHORIZED) res.sendStatus(401)
    else next()
  } catch (error) {
    next(error)
  }
}
export const sendResetMailPassword = async (req: any, res: any) => {
  if (!req.body.username) res.sendStatus(401)
  else {
    const dbProvider = {
      knex,
      logger: console,
      createPasswordHash: (password: any) => createPasswordHash(
        {
          genSaltSync,
          hashSync,
        },
        password
      ),
    }
    const response = await getResetPasswordToken(dbProvider, req.body)
    res.send(response)
  }
}
export const updateResetPasswordByToken = async (req: any, res: any) => {
  if (!req.body.password || !req.body.token) res.sendStatus(401)
  else {
    const dbProvider = {
      knex,
      logger: console,
      createPasswordHash: (password: any) => createPasswordHash(
        {
          genSaltSync,
          hashSync,
        },
        password
      ),
      passwordsMatch: (password: any, hash: any, salt: any) =>
        passwordsMatch(
          {
            hashSync,
          },
          password,
          hash,
          salt
        ),
    }
    const { error } = await updateResetPasswordUsingToken(dbProvider, req.body)
    if (error) res.sendStatus(404)
    else res.sendStatus(200)
  }
}

export const isAuthorizedController = async (req: any, res: any, next: any) => {
  try {
    res.status(201).send({ isAuthorized: true })
  } catch (error) {
    next(error)
  }
}
