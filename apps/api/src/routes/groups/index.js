import express from 'express'
import {
  searchGroupsController,
  updateGroupController,
  createGroupController,
  deleteGroupController,
} from '@/controllers/groups'

const router = express.Router()

router.get('/groups', searchGroupsController)
router.get('/groups/:id', searchGroupsController)
router.post('/groups', createGroupController)
router.patch('/groups/:id', updateGroupController)
router.delete('/groups/:id', deleteGroupController)
export default router
