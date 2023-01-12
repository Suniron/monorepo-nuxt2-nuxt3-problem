/**
 * This file stores all environmental variables needed by the backend.
 * Instead of flooding the code with "process.env.MY_VAR", all env variables are stored here.
 *
 * Benefits:
 * - Structured env variables
 * - Code autocompletion when using env variables
 *
 * // TODO: throw error when some variable are missing like JWT variables.
 */

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { version } from '../../package.json'

let httpsEnabled = false

if (process.env.NODE_ENV !== 'test') {
  dotenv.config()
  httpsEnabled
    = fs.existsSync(path.resolve(__dirname, '../../secrets/server_key.pem'))
    && fs.existsSync(path.resolve(__dirname, '../../secrets/server_cert.pem'))
}

// = Application =
export const appVersion = version
export const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL
export const INSTANCE_NAME = process.env.INSTANCE_NAME
export const APP_PORT = process.env.PORT || '3002'
export const POSTGRES_URI = process.env.POSTGRES_URI || ''
export const HTTPS_ENABLED = httpsEnabled

// = Node env =
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isTest = process.env.NODE_ENV === 'test'
export const isProduction = process.env.NODE_ENV === 'production'

// = JWT =
// Access token
export const JWT_ACCESS_AUDIENCE = process.env.JWT_ACCESS_AUD as string
export const JWT_ACCESS_ISSUER = process.env.JWT_ACCESS_ISS as string
export const JWT_ACCESS_LIFE = process.env.JWT_ACCESS_LIFE as string
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string
export const JWT_ACCESS_TYPE = process.env.JWT_ACCESS_TYPE as string

// Refresh Token
export const REFRESH_TOKEN_COOKIE_NAME = 'rt'
export const JWT_REFRESH_AUDIENCE = process.env.JWT_REFRESH_AUD as string
export const JWT_REFRESH_DOMAIN = process.env.JWT_REFRESH_DOMAIN as string
export const JWT_REFRESH_ISSUER = process.env.JWT_REFRESH_ISS as string
export const JWT_REFRESH_LIFE = process.env.JWT_REFRESH_LIFE as string
export const JWT_REFRESH_LIFE_MS = parseInt(process.env.JWT_REFRESH_LIFE_MS as string)
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string
export const JWT_REFRESH_TYPE = process.env.JWT_REFRESH_TYPE as string
