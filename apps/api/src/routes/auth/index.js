// @ts-check
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
import { passThroughController } from '@/controllers'

const router = express.Router()

// Validations
const loginPayloadValidation = celebrate({
  [Segments.BODY]: Joi.object({
    password: Joi.string().required(),
    username: Joi.string().required(),
  }),
})

const resetPayloadValidation = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string().required(),
  }),
})

// Public routes BEFORE JWT authentication
router.post('/login/credentials', loginPayloadValidation, loginController)
router.post('/refresh-token', refreshAccessTokenController)

router.patch('/reset-password', updatePasswordByToken)
router.post('/reset-password', resetPayloadValidation, resetPassword)

// JWT access token parsing for easier access (corresponding to light authentication in store)
router.use(jwtAuthParsing)

router.get('/is-authorized/light', passThroughController) // light auth check (no 2fa)
router.get('/is-authorized', passThroughController) // strong auth check (2fa)

router.get('/two-factor/setup', passThroughController)
router.post('/login/totp', passThroughController)

// Private routes AFTER JWT authentication
router.delete('/logout', logoutController)

export default router
