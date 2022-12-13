import path from 'path'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import addLoaders from '@/loaders'
import env from '@/config/env'

/**
 * Initializes and returns an express app ready to listen
 *
 * @returns Express app
 */
export default async function initServer() {
  const app = express()
  app.use(express.json({ limit: '50mb' }))
  if (!env.nodeEnv.isProduction) {
    // Empty catching in case api.yml file does not exists (no need to produce an error)
    try {
      const swaggerDocument = YAML.load(path.join(__dirname, '../api.yml'))
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    }
    catch (error) {}
  }

  await addLoaders(app)
  return app
}
