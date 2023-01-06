import { Router } from 'express'

import { fetchComplianceController } from '../../controllers/self-assessment'

const router = Router()
router.get('/compliance', fetchComplianceController)

export default router
