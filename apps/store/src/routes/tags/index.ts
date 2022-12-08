import express from 'express'
import {
  searchTagsController,
  createTagController,
  updateTagController,
  deleteTagController,
// @ts-expect-error TS(2307): Cannot find module '@/controllers/tags' or its cor... Remove this comment to see the full error message
} from '@/controllers/tags'

const router = express.Router()

router.get('/tags', searchTagsController)
router.get('/tags/:id', searchTagsController)
router.post('/tags', createTagController)
router.patch('/tags/:id', updateTagController)
router.delete('/tags/:id', deleteTagController)

export default router
