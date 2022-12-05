/**
 * This file stores all environmental variables needed by the backend.
 * Instead of flooding the code with "process.env.MY_VAR", all env variables are stored here.
 *
 * Benefits:
 * - Structured env variables
 * - Code autocompletion when using env variables
 */

import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { version } from '../../package.json'

dotenv.config()

const httpsEnabled =
  fs.existsSync(path.resolve(__dirname, '../../secrets/server_key.pem')) &&
  fs.existsSync(path.resolve(__dirname, '../../secrets/server_cert.pem'))

/**
 * Environmental variables
 */

export const buildEnvObj = (env) => ({
  port: env.PORT || '3001',
  httpsEnabled,
  mailServer: {
    MAIL_SERVER: env.MAIL_SERVER,
    MAIL_PORT: env.MAIL_PORT,
    MAIL_LOGIN: env.MAIL_LOGIN,
    MAIL_PASSWORD: env.MAIL_PASSWORD,
  },
  nodeEnv: {
    value: env.NODE_ENV || 'development',
    isProduction: env.NODE_ENV === 'production',
    isDevelopment: env.NODE_ENV === 'development',
    isTest: env.NODE_ENV === 'test',
  },
  store: {
    baseURL: env.STORE_BASE_URL || 'http://localhost:3002',
  },
  ui: {
    origin: env.PUBLIC_DOMAIN || 'http://localhost:3000',
  },
  self: {
    origin:
      env.PUBLIC_DOMAIN.replace(/:\d+/, `:${env.PORT}`) ||
      'http://localhost:3001',
  },
})

export const appVersion = version

export const isDev = process.env.NODE_ENV === 'development'
export const idTest = process.env.NODE_ENV === 'test'
export const isProd = process.env.NODE_ENV === 'production'

export const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL
export const INSTANCE_NAME = process.env.INSTANCE_NAME

export default buildEnvObj(process.env)
