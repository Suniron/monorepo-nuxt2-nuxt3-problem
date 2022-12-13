import express from 'express'
import loadGeneral from '../../src/loaders/general-loader'
import loadLogger from '../../src/loaders/logger-loader'
import loadRoutes from '../../src/loaders/routes-loader'
import loadErrorHandler from '../../src/loaders/error-handler-loader'

const app = express()

loadGeneral(app)
loadLogger(app)
loadRoutes(app)
loadErrorHandler(app)

export default app
