import express from 'express'
import path from 'path'
// @ts-expect-error TS(2307): Cannot find module '@/config/env' or its correspon... Remove this comment to see the full error message
import env from '@/config/env'
// @ts-expect-error TS(2307): Cannot find module '@/loaders' or its correspondin... Remove this comment to see the full error message
import addLoaders from '@/loaders'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'swag... Remove this comment to see the full error message
import swaggerUi from 'swagger-ui-express'
// @ts-expect-error TS(7016): Could not find a declaration file for module 'yaml... Remove this comment to see the full error message
import YAML from 'yamljs'
import { sanitizerMiddleware } from './utils/strings'
import { log } from './lib/logger'

/**
 * Initializes and returns an express app ready to listen
 *
 * @returns Express app
 */
export default async function initServer() {
  const app = express()
  app.use(express.json({ limit: '50mb' }))
  app.use(sanitizerMiddleware)

  if (!env.nodeEnv.isProduction) {
    // Empty catching in case api.yml file does not exists (no need to produce an error)
    try {
      const swaggerDocument = YAML.load(path.join(__dirname, '../api.yml'))
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    } catch (error) {
      // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
      log.error(error)
    }
  }

  await addLoaders(app)
  return app
}
