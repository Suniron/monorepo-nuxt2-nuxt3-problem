import { Router } from 'express'

import { searchSeveritiesController } from '../../controllers/severities'

const router = Router()

// Severities endpoints
router.get('/severities/', searchSeveritiesController)
router.get('/severities/:id', searchSeveritiesController)

export default router
