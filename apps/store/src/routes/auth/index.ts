import express from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import {
  loginController,
  jwtVerify,
  refreshAccessTokenController,
  logoutController,
  verifyAssetPermissionController,
  isAuthorizedController,
  sendResetMailPassword,
  updateResetPasswordByToken,

} from '../../controllers/auth'

const router = express.Router()

// Validations
const loginPayloadValidation = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
})

// Public routes for authentication
router.post('/login', loginPayloadValidation, loginController)
router.post('/refresh-token', refreshAccessTokenController)
router.post('/reset-password', sendResetMailPassword)
router.patch('/reset-password', updateResetPasswordByToken)
// Authentication point
router.use(jwtVerify)
router.use('/assets/:id', verifyAssetPermissionController)

// Private routes after authentication
router.delete('/logout', logoutController)
router.get('/is-authorized', isAuthorizedController)

export default router
