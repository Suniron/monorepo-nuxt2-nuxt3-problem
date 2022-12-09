import express from 'express'
import { Joi, Segments, celebrate, errors } from 'celebrate'
import {
  createUserController,
  deleteUserController,
  searchUsersController,
  updateUserController,

} from '../../controllers/users'

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

const updateUserValidation = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().optional(),
    firstName: Joi.string().optional(),
    groupIds: Joi.array().items(Joi.number()).optional(),
    lastName: Joi.string().optional(),
    oldPassword: Joi.string().optional(),
    password1: Joi.string().optional(),
    password2: Joi.string().optional(),
    roles: Joi.array().items(Joi.string().valid('member', 'admin')).optional(),
    username: Joi.string().optional(),
  }),
})

// Routes
router.get('/users', searchUsersController)
router.get('/users/:id', searchUsersController)
router.post('/users', createUserValidation, createUserController)
router.patch('/users/:id', updateUserValidation, updateUserController)
router.delete('/users/:id', deleteUserController)
router.use(errors())

export default router
