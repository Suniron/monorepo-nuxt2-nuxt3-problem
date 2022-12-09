import loadGeneral from '../../src/loaders/general-loader'

import loadLogger from '../../src/loaders/logger-loader'

import loadRoutes from '../../src/loaders/routes-loader'

import loadErrorHandler from '../../src/loaders/error-handler-loader'

export default async function addLoaders(app: any) {
  await loadGeneral(app)
  await loadLogger(app)
  await loadRoutes(app)
  await loadErrorHandler(app)
  return app
}
