// @ts-check
import express from 'express'
// @ts-expect-error TS(2307): Cannot find module '@/controllers/severities' or i... Remove this comment to see the full error message
import { searchSeveritiesController } from '@/controllers/severities'

const router = express.Router()

// Severities endpoints
router.get('/severities/', searchSeveritiesController)
router.get('/severities/:id', searchSeveritiesController)

export default router
