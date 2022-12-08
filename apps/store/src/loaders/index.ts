import loadGeneral from '@/loaders/general-loader'
import loadLogger from '@/loaders/logger-loader'
import loadRoutes from '@/loaders/routes-loader'
import loadErrorHandler from '@/loaders/error-handler-loader'

export default async function addLoaders(app) {
  await loadGeneral(app)
  await loadLogger(app)
  await loadRoutes(app)
  await loadErrorHandler(app)
  return app
}
