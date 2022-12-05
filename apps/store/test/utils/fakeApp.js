import express from 'express'
import loadGeneral from '@/loaders/general-loader'
import loadLogger from '@/loaders/logger-loader'
import loadRoutes from '@/loaders/routes-loader'
import loadErrorHandler from '@/loaders/error-handler-loader'

const app = express()

loadGeneral(app)
loadLogger(app)
loadRoutes(app)
loadErrorHandler(app)

export default app
