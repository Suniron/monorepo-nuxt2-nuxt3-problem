/**
 * This file stores all environmental variables needed by the backend.
 * Instead of flooding the code with "process.env.MY_VAR", all env variables are stored here.
 *
 * Benefits:
 * - Structured env variables
 * - Code autocompletion when using env variables
 */

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { version } from '../../package.json'

dotenv.config()

const httpsEnabled
  = fs.existsSync(path.resolve(__dirname, '../../secrets/server_key.pem'))
  && fs.existsSync(path.resolve(__dirname, '../../secrets/server_cert.pem'))

/**
 * Environmental variables
 */

if (!process.env.MAIL_LOGIN || !process.env.MAIL_PASSWORD || !process.env.MAIL_SERVER || !process.env.MAIL_PORT)
  console.warn('💥 Missing mail server credentials. Please set MAIL_LOGIN, MAIL_PASSWORD, MAIL_SERVER and MAIL_PORT in .env file. Password can\t be reset without mail server credentials.')

export const buildEnvObj = env => ({
  httpsEnabled,
  mailServer: {
    MAIL_LOGIN: env.MAIL_LOGIN,
    MAIL_PASSWORD: env.MAIL_PASSWORD,
    MAIL_PORT: env.MAIL_PORT,
    MAIL_SERVER: env.MAIL_SERVER,
  },
  nodeEnv: {
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
    value: env.NODE_ENV || 'development',
  },
  port: env.PORT || '3001',
  self: {
    origin:
      env.PUBLIC_DOMAIN.replace(/:\d+/, `:${env.PORT}`)
      || 'http://localhost:3001',
  },
  store: {
    baseURL: env.STORE_BASE_URL || 'http://localhost:3002',
  },
  ui: {
    origin: env.PUBLIC_DOMAIN || 'http://localhost:3000',
  },
})

export const appVersion = version

export const isDev = process.env.NODE_ENV === 'development'
export const idTest = process.env.NODE_ENV === 'test'
export const isProd = process.env.NODE_ENV === 'production'

export const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL
export const INSTANCE_NAME = process.env.INSTANCE_NAME

export default buildEnvObj(process.env)
