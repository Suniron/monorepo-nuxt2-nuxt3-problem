import express from 'express'
import {
  searchTagsController,
  createTagController,
  updateTagController,
  deleteTagController,
} from '@/controllers/tags'

const router = express.Router()

router.get('/tags', searchTagsController)
router.get('/tags/:id', searchTagsController)
router.post('/tags', createTagController)
router.patch('/tags/:id', updateTagController)
router.delete('/tags/:id', deleteTagController)

export default router
