import express from 'express'
import {
  searchTagsController,
  createTagController,
  deleteTagController,
} from '@/controllers/tags'
import { passThroughController } from '@/controllers'

const router = express.Router()

router.get('/tags', searchTagsController)
router.get('/tags/:id', searchTagsController)
router.post('/tags', createTagController)
router.patch('/tags/:id', passThroughController)
router.delete('/tags/:id', deleteTagController)

export default router
