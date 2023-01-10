import path from 'path'
import express from 'express'

import swaggerUi from 'swagger-ui-express'

import YAML from 'yamljs'
import addLoaders from '../src/loaders'
import { isProduction } from './config/env'
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

  if (!isProduction) {
    // Empty catching in case api.yml file does not exists (no need to produce an error)
    try {
      const swaggerDocument = YAML.load(path.join(__dirname, '../api.yml'))
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    }
    catch (error) {
      log.withError(error).error('initServer')
    }
  }

  await addLoaders(app)
  return app
}
