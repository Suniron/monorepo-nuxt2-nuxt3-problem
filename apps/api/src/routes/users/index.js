import express from 'express'
import {
  createUserController,
  searchUsersController,
  updateUserController,
  deleteUserController,
} from '@/controllers/users'
import { celebrate, Segments, Joi, errors } from 'celebrate'

const router = express.Router()

// Validations
const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    roles: Joi.array().items(Joi.string().valid('member', 'admin')).optional(),
  }),
})

// Routes
router.get('/users', searchUsersController)
router.get('/users/:id', searchUsersController)
router.post('/users', createUserValidation, createUserController)
router.patch('/users/:id', updateUserController)
router.delete('/users/:id', deleteUserController)
router.use(errors())

export default router
