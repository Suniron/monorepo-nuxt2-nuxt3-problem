import { Router } from 'express'
import { Joi, Segments, celebrate } from 'celebrate'
import {
  isAuthorizedController,
  jwtVerify,
  loginWithPasswordController,
  logoutController,
  refreshAccessTokenController,
  sendResetMailPassword,
  updateResetPasswordByToken,
  verifyAssetPermissionController,
} from '../../controllers/auth'

const router = Router()

// Validations
const loginWithPasswordPayloadValidation = celebrate({
  [Segments.BODY]: Joi.object({
    password: Joi.string().required(),
    username: Joi.string().required(),
  }),
})

// Public routes for authentication
router.post('/login/password', loginWithPasswordPayloadValidation, loginWithPasswordController)
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
