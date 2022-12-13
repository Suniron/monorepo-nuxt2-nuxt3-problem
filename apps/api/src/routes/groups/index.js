import express from 'express'
import {
  createGroupController,
  deleteGroupController,
  searchGroupsController,
  updateGroupController,
} from '@/controllers/groups'

const router = express.Router()

router.get('/groups', searchGroupsController)
router.get('/groups/:id', searchGroupsController)
router.post('/groups', createGroupController)
router.patch('/groups/:id', updateGroupController)
router.delete('/groups/:id', deleteGroupController)
export default router
