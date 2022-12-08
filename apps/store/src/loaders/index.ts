// @ts-expect-error TS(2307): Cannot find module '@/loaders/general-loader' or i... Remove this comment to see the full error message
import loadGeneral from '@/loaders/general-loader'
// @ts-expect-error TS(2307): Cannot find module '@/loaders/logger-loader' or it... Remove this comment to see the full error message
import loadLogger from '@/loaders/logger-loader'
// @ts-expect-error TS(2307): Cannot find module '@/loaders/routes-loader' or it... Remove this comment to see the full error message
import loadRoutes from '@/loaders/routes-loader'
// @ts-expect-error TS(2307): Cannot find module '@/loaders/error-handler-loader... Remove this comment to see the full error message
import loadErrorHandler from '@/loaders/error-handler-loader'

export default async function addLoaders(app: any) {
  await loadGeneral(app)
  await loadLogger(app)
  await loadRoutes(app)
  await loadErrorHandler(app)
  return app
}
