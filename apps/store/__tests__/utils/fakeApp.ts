import express from 'express'
// @ts-expect-error TS(2307): Cannot find module '@/loaders/general-loader' or i... Remove this comment to see the full error message
import loadGeneral from '@/loaders/general-loader'
// @ts-expect-error TS(2307): Cannot find module '@/loaders/logger-loader' or it... Remove this comment to see the full error message
import loadLogger from '@/loaders/logger-loader'
// @ts-expect-error TS(2307): Cannot find module '@/loaders/routes-loader' or it... Remove this comment to see the full error message
import loadRoutes from '@/loaders/routes-loader'
// @ts-expect-error TS(2307): Cannot find module '@/loaders/error-handler-loader... Remove this comment to see the full error message
import loadErrorHandler from '@/loaders/error-handler-loader'

const app = express()

loadGeneral(app)
loadLogger(app)
loadRoutes(app)
loadErrorHandler(app)

export default app
