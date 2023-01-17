import { Router } from 'express'

import { updateFearedEventsController } from '../../controllers/fearedEvents'

const router = Router()

// FearedEvent endpoints
router.patch('/feared-events/:id', updateFearedEventsController)

export default router
