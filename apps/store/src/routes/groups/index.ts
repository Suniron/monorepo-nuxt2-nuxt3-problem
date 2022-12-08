import express from 'express'
import {
  searchGroupsController,
  updateGroupController,
  createGroupController,
  deleteGroupController,
} from '@/controllers/groups'
import { celebrate, Joi, Segments } from 'celebrate'

const router = express.Router()

// Validations
const updateGroupValidations = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().optional(),
    memberIds: Joi.array().items(Joi.string().uuid()).optional(),
  }),
})

const createGroupValidation = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required(),
    memberIds: Joi.array().items(Joi.string().uuid()).optional(),
  }),
})

router.get('/groups', searchGroupsController)
router.get('/groups/:id', searchGroupsController)
router.post('/groups', createGroupValidation, createGroupController)
router.patch('/groups/:id', updateGroupValidations, updateGroupController)
router.delete('/groups/:id', deleteGroupController)
export default router
