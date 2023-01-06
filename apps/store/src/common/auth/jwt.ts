import type { SignOptions } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import env from '../../config/env'

import { UNAUTHORIZED } from '../constants'

export const ALGORITHM = 'HS512'
export const TOKEN_TYPE = Object.freeze({
  access: 'access',
  refresh: 'refresh',
})

export type JWTTokenType = 'access' | 'refresh'

/**
 * It generates a JWT token with the given configuration.
 *
 * Usable for both access and refresh token
 */
export const generateJWTToken = (tokenType: JWTTokenType, payload: string | object) => {
  const secretKey: string = tokenType === 'access' ? env.jwt.access.secret : env.jwt.refresh.secret
  const signOptions: SignOptions = tokenType === 'access'
    ? {
        audience: env.jwt.access.audience,
        expiresIn: env.jwt.access.life,
        issuer: env.jwt.access.issuer,
      }
    : {
        audience: env.jwt.refresh.audience,
        expiresIn: env.jwt.refresh.life,
        issuer: env.jwt.refresh.issuer,
      }

  const generatedToken = jwt.sign(payload, secretKey, signOptions)
  return generatedToken
}

/**
 * It generates an access and refresh token with the given payload
 */
export const generateJwtTokens = (payload: string | object) => {
  const accessToken = generateJWTToken('access', payload)
  const refreshToken = generateJWTToken('refresh', payload)
  return { accessToken, refreshToken }
}

/**
 * User data saved in a JWT token payload
 *
 * @typedef {object} JWTTokenPayload
 * @property {string} id User id
 * @property {string} firstName First name of user
 * @property {string} lastName Last name of user
 * @property {string} username Username of user
 * @property {string} email Email of user
 * @property {number} companyId ID of the company to which user belongs
 * @property {string} companyName Name of the company to which user belongs
 * @property {string} typ Type of JWT token. Can be either "access" or "refresh"
 * @property {number} iat Issued at timestamp of token
 * @property {number} exp Expires at timestamp of token
 * @property {string} aud Audience of token
 * @property {string} iss Issuer of token
 */

/**
 * Semantical subset of Environmental variables used by JWT verify
 * @typedef {object} JWTEnv
 * @property {{
 *  access: {
 *    secret: string,
 *    audience: string,
 *    issuer: string,
 *    type: string
 *  },
 *  refresh: {
 *    secret: string,
 *    audience: string,
 *    issuer: string,
 *    type: string
 *  },
 * }} jwt JWT configurations for both access and refresh tokens
 */

/**
 * Verify a JWT token
 *
 * @typedef {(token: string, secret: string,verifyOpts: { algorithms: string[], audience: string, issuer: string }) => JWTTokenPayload } VerifyJWTToken
 * @throws
 * @returns {JWTTokenPayload} User information saved as payload of JWT token
 */

/**
 * JWT session object saved in database
 *
 * @typedef {object} JWTSession
 * @property {string} id Session id
 * @property {string} user_id User id
 * @property {string} token JWT token saved in DB
 * @property {string} type JWT token type. Can be either "access" or "refresh"
 * @property {Date} created_at When the JWT token was stored in DB
 * @property {Date | null} deleted_at When the JWT record was invalidated
 */

/**
 * Verifies a JWT token and returns its saved payload
 *
 * @param {object} provider Services provider for verifying token
 * @param {VerifyJWTToken} provider.verifyJWTToken Function that verifies the JWT token
 * @param {JWTEnv} provider.env Environmental variables for JWT configuration
 * @param {{ error: (err: any) => void }} provider.logger Logger used to log information
 * @param {(token: string, type: string) => Promise<{ session: JWTSession} | { error: string }>} provider.getTokenSessionModel Retrieves a stored sessions associated to a token
 * @param {string} token JWT token to be verified
 * @param {string} type Type of JWT token. Can be either "access" or "refresh"
 */
export const verifyToken = async (provider: any, token: any, type: any) => {
  const { verifyJWTToken, env, logger, getTokenSessionModel } = provider
  try {
    const tokenConfig
      = type === TOKEN_TYPE.access ? env.jwt.access : env.jwt.refresh
    const { secret, audience, issuer, type: configType } = tokenConfig

    if (type !== configType)
      throw new Error(`Invalid token type: ${type}`)

    const { error, session } = await getTokenSessionModel(token, type)
    if (error)
      throw new Error(error)

    const user = verifyJWTToken(token, secret, {
      algorithms: [ALGORITHM],
      audience,
      issuer,
    })
    if (!user) {
      throw new Error('Invalid token')
    }
    else if (user.id !== session.user_id) {
      throw new Error(
        'Token user.id does not match with user_id of stored session',
      )
    }

    return { user }
  }
  catch (error) {
    logger.error(error)
    return { error: UNAUTHORIZED }
  }
}
