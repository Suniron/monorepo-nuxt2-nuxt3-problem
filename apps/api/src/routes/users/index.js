import express from 'express'
import { Joi, Segments, celebrate, errors } from 'celebrate'
import {
  createUserController,
  deleteUserController,
  searchUsersController,
  updateUserController,
} from '@/controllers/users'

const router = express.Router()

// Validations
const createUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
    roles: Joi.array().items(Joi.string().valid('member', 'admin')).optional(),
    username: Joi.string().required(),
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
