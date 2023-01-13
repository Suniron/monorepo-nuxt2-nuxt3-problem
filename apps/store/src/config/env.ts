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
  = fs.existsSync(path.resolve(__dirname, '../../../../secrets/server_key.pem'))
  && fs.existsSync(path.resolve(__dirname, '../../../../secrets/server_cert.pem'))

/**
 * Environmental variables
 */
export const buildEnvObj = (env: any) =>
  Object.freeze({
    httpsEnabled,
    jwt: Object.freeze({
      access: Object.freeze({
        audience: env.JWT_ACCESS_AUD,
        issuer: env.JWT_ACCESS_ISS,
        life: env.JWT_ACCESS_LIFE,
        secret: env.JWT_ACCESS_SECRET,
        type: env.JWT_ACCESS_TYPE,
      }),
      refresh: Object.freeze({
        audience: env.JWT_REFRESH_AUD,
        domain: env.JWT_REFRESH_DOMAIN,
        issuer: env.JWT_REFRESH_ISS,
        life: env.JWT_REFRESH_LIFE,
        lifeInMs: Number(env.JWT_REFRESH_LIFE_MS),
        secret: env.JWT_REFRESH_SECRET,
        type: env.JWT_REFRESH_TYPE,
      }),
    }),
    nodeEnv: Object.freeze({
      isDevelopment: env.NODE_ENV === 'development',
      isProduction: env.NODE_ENV === 'production',
      isTest: env.NODE_ENV === 'test',
      value: env.NODE_ENV || 'development',
    }),
    port: env.PORT || '3002',
    postgres: Object.freeze({
      URI: env.POSTGRES_URI || '',
    }),
  })

export const appVersion = version

export const isDev = process.env.NODE_ENV === 'development'
export const idTest = process.env.NODE_ENV === 'test'
export const isProd = process.env.NODE_ENV === 'production'

export const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL
export const INSTANCE_NAME = process.env.INSTANCE_NAME

export default buildEnvObj(process.env)
