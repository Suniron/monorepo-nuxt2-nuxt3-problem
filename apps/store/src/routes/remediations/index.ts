import express from 'express'

import { searchGroupedRemediationsController } from '../../controllers/remediations'

const router = express.Router()

// Remediations endpoints
router.get('/remediations/grouped', searchGroupedRemediationsController)

export default router
