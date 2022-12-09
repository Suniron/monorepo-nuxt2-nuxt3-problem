import jwt from 'jsonwebtoken'
import env from '../../config/env'

import { UNAUTHORIZED } from '../constants'

export const ALGORITHM = 'HS512'
export const TOKEN_TYPE = Object.freeze({
  access: 'access',
  refresh: 'refresh',
})

/**
 * A JWT configuration object
 * @typedef {object} JWTConfig
 * @property {string} secret Token secret used to sign it
 * @property {string} expiresIn String describing a time span zeit/ms. i.e. "30m", "90d"
 * @property {string} audience JWT intended audience
 * @property {string} issuer The issuer of the JWT token
 * @property {string} type Type of token. Can be either "access" or "refresh"
 */

/**
 * Generates a JWT token with the given configuration
 *
 * @param {(payload: any, secret: string, options: JWTConfig) => string} jwtSign Function used to sign a token
 * @param {JWTConfig} config
 * @param {any} payload
 * @returns {string} JWT token
 */
export const generateJWTToken = (jwtSign: any, config: any, payload: any) => {
  const { secret, expiresIn, audience, issuer, type } = config

  const token = jwtSign({ ...payload, typ: type }, secret, {
    algorithm: ALGORITHM,
    audience,
    expiresIn,
    issuer,
  })

  return token
}

/**
 * Generates an access and refresh token with the given payloads
 *
 * @param {{
 *   jwtSign: (payload: any, secret: string, options: JWTConfig) => string,
 *   accessConfig: JWTConfig,
 *   refreshConfig: JWTConfig
 * }} provider
 * @param {any} accessPayload Payload to be included in an access token
 * @param {any} refreshPayload Payload to be included in a refresh token
 * @returns
 */
export const generateTokens = (provider: any, accessPayload: any, refreshPayload: any) => {
  const { jwtSign, accessConfig, refreshConfig } = provider

  const accessToken = generateJWTToken(jwtSign, accessConfig, accessPayload)
  const refreshToken = generateJWTToken(jwtSign, refreshConfig, refreshPayload)

  return { accessToken, refreshToken }
}

/**
 *
 * @param {{
 * id: import('@prisma/client').user['id'],
 * firstName: import('@prisma/client').user['first_name'],
 * lastName: import('@prisma/client').user['last_name'],
 * username: import('@prisma/client').user['username'],
 * email: import('@prisma/client').user['email'],
 * companyId: import('@prisma/client').user['company_id'],
 * companyName: import('@prisma/client').company['name'],
 * roles: import('@prisma/client').user['roles'],
 * groups: import('@prisma/client').user_group['group_id'][],
 * }} payload
 * @returns
 */
export const generateAccessToken = (payload: any) => {
  const { access } = env.jwt

  return generateJWTToken(
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
