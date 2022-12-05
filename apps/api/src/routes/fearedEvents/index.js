import express from 'express'
import { updateFearedEventsController } from '@/controllers/fearedEvents'

const router = express.Router()

// Feared Events endpoints
router.patch('/feared-events/:id', updateFearedEventsController)
export default router
