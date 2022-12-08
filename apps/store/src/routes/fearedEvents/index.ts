// @ts-check
import express from 'express'
// @ts-expect-error TS(2307): Cannot find module '@/controllers/fearedEvents' or... Remove this comment to see the full error message
import { updateFearedEventsController } from '@/controllers/fearedEvents'

const router = express.Router()

// FearedEvent endpoints
router.patch('/feared-events/:id', updateFearedEventsController)

export default router
