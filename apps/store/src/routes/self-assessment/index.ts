import express from 'express'

import { fetchComplianceController } from '../../controllers/self-assessment'

const router = express.Router()
router.get('/compliance', fetchComplianceController)

export default router
