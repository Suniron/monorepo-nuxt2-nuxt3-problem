import express from 'express'
import { Joi, Segments, celebrate } from 'celebrate'
import {
  jwtAuthParsing,
  loginController,
  logoutController,
  refreshAccessTokenController,
  resetPassword,
  updatePasswordByToken,
} from '@/controllers/auth'

const router = express.Router()

// Validations
const loginPayloadValidation = celebrate({
  [Segments.BODY]: Joi.object({
    password: Joi.string().required(),
    username: Joi.string().required(),
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
