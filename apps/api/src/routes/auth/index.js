import express from 'express'
import {
  jwtAuthParsing,
  loginController,
  refreshAccessTokenController,
  logoutController,
  resetPassword,
  updatePasswordByToken,
} from '@/controllers/auth'
import { celebrate, Segments, Joi } from 'celebrate'

const router = express.Router()

// Validations
const loginPayloadValidation = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
})

// Public routes BEFORE JWT authentication
router.post('/login', loginPayloadValidation, loginController)
router.post('/refresh-token', refreshAccessTokenController)

router.patch('/reset-password', updatePasswordByToken)
router.post('/reset-password', resetPassword)

// JWT access token parsing for easier access
router.use(jwtAuthParsing)

// Private routes AFTER JWT authentication
router.delete('/logout', logoutController)

export default router
