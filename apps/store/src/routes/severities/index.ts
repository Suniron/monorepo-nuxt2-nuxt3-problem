import express from 'express'

import { searchSeveritiesController } from '../../controllers/severities'

const router = express.Router()

// Severities endpoints
router.get('/severities/', searchSeveritiesController)
router.get('/severities/:id', searchSeveritiesController)

export default router
