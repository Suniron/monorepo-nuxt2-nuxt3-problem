import express from 'express'

import { searchProjectPrioritiesController } from '../../controllers/project-priorities'

const router = express.Router()

// Severities endpoints
router.get('/projects/priorities/', searchProjectPrioritiesController)
router.get('/projects/priorities/:id', searchProjectPrioritiesController)

export default router
