import { Router } from 'express'

import { generateController } from '../../controllers/reports'

const router = Router()

router.get('/reports', generateController)

export default router
