import { Router } from 'express'
import { Joi, Segments, celebrate } from 'celebrate'
import {
  isAuthorizedController,
  loginWithCredentialsController,
  logoutController,
  refreshAccessTokenController,
  sendResetMailPassword,
  updateResetPasswordByToken,
  verifyAssetPermissionController,
} from '../../controllers/auth'
import { lightAuthenticationVerify, strongAuthenticationVerify } from '../../middlewares/authentication'
import { loginWithTotpController, twoFactorSetupController } from '../../controllers/auth/twoFactor'

const router = Router()

// Validations
const loginWithCredentialsValidation = celebrate({
  [Segments.BODY]: Joi.object({
    password: Joi.string().required(),
    username: Joi.string().required(),
  }),
})

const loginWithTotpValidation = celebrate({
  [Segments.BODY]: Joi.object({
    totp: Joi.number().integer().required(),
  }),
})

// Public routes for authentication
router.post('/login/credentials', loginWithCredentialsValidation, loginWithCredentialsController)
router.post('/refresh-token', refreshAccessTokenController)
router.post('/reset-password', sendResetMailPassword)
router.patch('/reset-password', updateResetPasswordByToken)

// Light authentication point (used to jump to 2fa setup / 2fa sign-in)
router.use(lightAuthenticationVerify)
router.get('/is-authorized/light', isAuthorizedController)

router.get('/2fa/setup', twoFactorSetupController)
router.post('/login/totp', loginWithTotpValidation, loginWithTotpController)

// Strong authentication point
router.use(strongAuthenticationVerify)
router.get('/is-authorized', isAuthorizedController)
// Authentication point
router.use('/assets/:id', verifyAssetPermissionController)

// Private routes after authentication
router.delete('/logout', logoutController)

export default router
