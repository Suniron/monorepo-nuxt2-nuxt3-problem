// @ts-check
import express from 'express'
// @ts-expect-error TS(2307): Cannot find module '@/controllers/project-prioriti... Remove this comment to see the full error message
import { searchProjectPrioritiesController } from '@/controllers/project-priorities'

const router = express.Router()

// Severities endpoints
router.get('/projects/priorities/', searchProjectPrioritiesController)
router.get('/projects/priorities/:id', searchProjectPrioritiesController)

export default router
