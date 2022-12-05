import express from 'express'
import { searchGroupedRemediationsController } from '@/controllers/remediations'

const router = express.Router()

// Severities endpoints
router.get('/remediations/grouped', searchGroupedRemediationsController)
export default router
