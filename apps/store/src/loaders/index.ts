import type { Application } from 'express'
import loadGeneral from '../../src/loaders/general-loader'
import loadLogger from '../../src/loaders/logger-loader'
import loadRoutes from '../../src/loaders/routes-loader'
import loadErrorHandler from '../../src/loaders/error-handler-loader'
import loadPassport from '../../src/loaders/passport'

export default async function addLoaders(app: Application) {
  await loadGeneral(app)
  await loadPassport(app)
  await loadLogger(app)
  await loadRoutes(app)
  await loadErrorHandler(app)
  return app
}
