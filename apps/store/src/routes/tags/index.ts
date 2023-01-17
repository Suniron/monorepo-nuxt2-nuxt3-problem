import { Router } from 'express'
import {
  createTagController,
  deleteTagController,
  searchTagsController,
  updateTagController,
} from '../../controllers/tags'

const router = Router()

router.get('/tags', searchTagsController)
router.get('/tags/:id', searchTagsController)
router.post('/tags', createTagController)
router.patch('/tags/:id', updateTagController)
router.delete('/tags/:id', deleteTagController)

export default router
