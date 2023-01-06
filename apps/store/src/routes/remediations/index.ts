import { Router } from 'express'

import { searchGroupedRemediationsController } from '../../controllers/remediations'

const router = Router()

// Remediations endpoints
router.get('/remediations/grouped', searchGroupedRemediationsController)

export default router
