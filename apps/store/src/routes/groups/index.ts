import { Router } from 'express'
import { Joi, Segments, celebrate } from 'celebrate'
import {
  createGroupController,
  deleteGroupController,
  searchGroupsController,
  updateGroupController,
} from '../../controllers/groups'

const router = Router()

// Validations
const updateGroupValidations = celebrate({
  [Segments.BODY]: Joi.object({
    memberIds: Joi.array().items(Joi.string().uuid()).optional(),
    name: Joi.string().optional(),
  }),
})

const createGroupValidation = celebrate({
  [Segments.BODY]: Joi.object({
    memberIds: Joi.array().items(Joi.string().uuid()).optional(),
    name: Joi.string().required(),
  }),
})

router.get('/groups', searchGroupsController)
router.get('/groups/:id', searchGroupsController)
router.post('/groups', createGroupValidation, createGroupController)
router.patch('/groups/:id', updateGroupValidations, updateGroupController)
router.delete('/groups/:id', deleteGroupController)
export default router
