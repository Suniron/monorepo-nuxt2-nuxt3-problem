import type { JwtTokenType } from '@prisma/client'
import type { Algorithm, SignOptions } from 'jsonwebtoken'
import jwt, { verify } from 'jsonwebtoken'
import { JWT_ACCESS_AUDIENCE, JWT_ACCESS_ISSUER, JWT_ACCESS_LIFE, JWT_ACCESS_SECRET, JWT_REFRESH_AUDIENCE, JWT_REFRESH_ISSUER, JWT_REFRESH_LIFE, JWT_REFRESH_SECRET } from '../../config/env'
import { log } from '../../lib/logger'
import prismaClient from '../../prismaClient'
import { getTokenInfoRequest } from '../../requests/tokens'
import type { SanitizedUser } from '../../utils/user.utils'
import { MODEL_ERROR, UNAUTHORIZED } from '../constants'

const HASH_ALGORITHM: Algorithm = 'HS512'
export const TOKEN_TYPE = Object.freeze({
  access: 'access',
  refresh: 'refresh',
})

export interface JwtTokenPayloadInput extends SanitizedUser {
  companyName: string
  fullyConnected: boolean
}

export interface JwtTokenPayload extends JwtTokenPayloadInput {
  iat: number
  exp: number
  iss: string
  aud: string
}

/**
 * It generates a JWT token with the given configuration.
 *
 * Usable for both access and refresh token
 */
export const generateJWTToken = (tokenType: JwtTokenType, payload: JwtTokenPayloadInput) => {
  const secretKey = tokenType === 'access' ? JWT_ACCESS_SECRET : JWT_REFRESH_SECRET
  const signOptions: SignOptions = tokenType === 'access'
    ? {
        audience: JWT_ACCESS_AUDIENCE,
        expiresIn: JWT_ACCESS_LIFE,
        issuer: JWT_REFRESH_ISSUER,
      }
    : {
        audience: JWT_REFRESH_AUDIENCE,
        expiresIn: JWT_REFRESH_LIFE,
        issuer: JWT_REFRESH_ISSUER,
      }

  const generatedToken = jwt.sign(payload, secretKey, signOptions)
  return generatedToken
}

/**
 * It generates an access and refresh token with the given payload.
 *
 * By default, it generates a non fully connected token.
 */
export const generateJwtTokens = (userInfo: SanitizedUser & { companyName: string; fullyConnected: boolean }) => {
  const accessToken = generateJWTToken('access', userInfo)
  const refreshToken = generateJWTToken('refresh', userInfo)
  return { accessToken, refreshToken }
}

/**
 * // TODO: add unit tests
 */
export const verifyToken = (token: string, tokenType: JwtTokenType) => {
  try {
    const payload = verify(
      token,
      tokenType === 'access' ? JWT_ACCESS_SECRET : JWT_REFRESH_SECRET,
      {
        algorithms: [
          HASH_ALGORITHM,
          // TODO: remove 'HS256' algorithm
          'HS256',
        ],
        audience: tokenType === 'access' ? JWT_ACCESS_AUDIENCE : JWT_REFRESH_AUDIENCE,
        issuer: tokenType === 'access' ? JWT_ACCESS_ISSUER : JWT_REFRESH_ISSUER,
      }) as JwtTokenPayload

    return { payload }
  }
  catch (error) {
    log.withError(error).error('verifyToken')

    const message = (error as any)?.message as string
    if (message) {
      if (message.includes('jwt expired'))
        return { error: UNAUTHORIZED, errorMessage: 'token expired' }
      else if (message.includes('invalid signature'))
        return { error: UNAUTHORIZED, errorMessage: 'invalid signature' }
      else if (message.includes('jwt malformed'))
        return { error: UNAUTHORIZED, errorMessage: 'token malformed' }
    }

    return { error: MODEL_ERROR, errorMessage: 'unknown error' }
  }
}
