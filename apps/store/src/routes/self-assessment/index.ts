import express from 'express'
// @ts-expect-error TS(2307): Cannot find module '@/controllers/self-assessment'... Remove this comment to see the full error message
import { fetchComplianceController } from '@/controllers/self-assessment'

const router = express.Router()
router.get('/compliance', fetchComplianceController)

export default router
