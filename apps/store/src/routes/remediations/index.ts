// @ts-check
import express from 'express'
// @ts-expect-error TS(2307): Cannot find module '@/controllers/remediations' or... Remove this comment to see the full error message
import { searchGroupedRemediationsController } from '@/controllers/remediations'

const router = express.Router()

// Remediations endpoints
router.get('/remediations/grouped', searchGroupedRemediationsController)

export default router
