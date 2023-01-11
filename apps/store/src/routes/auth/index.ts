import { Router } from 'express'
import { Joi, Segments, celebrate } from 'celebrate'
import {
  isAuthorizedController,
  jwtVerifyOld,
  loginWithCredentialsController,
  logoutController,
  refreshAccessTokenController,
  sendResetMailPassword,
  updateResetPasswordByToken,
  verifyAssetPermissionController,
} from '../../controllers/auth'
import { lightAuthenticationVerify } from '../../middlewares/authentication'

const router = Router()

// Validations
const loginWithCredentialsValidation = celebrate({
  [Segments.BODY]: Joi.object({
    password: Joi.string().required(),
    username: Joi.string().required(),
  }),
})

// Public routes for authentication
router.post('/login/password', loginWithCredentialsValidation, loginWithCredentialsController)
router.post('/refresh-token', refreshAccessTokenController)
router.post('/reset-password', sendResetMailPassword)
router.patch('/reset-password', updateResetPasswordByToken)

// Light authentication point (used to jump to 2fa setup / sign-in)
router.use(lightAuthenticationVerify)
router.get('/is-authorized/light', isAuthorizedController)

// Strong authentication point

// Authentication point
router.use(jwtVerifyOld) // TODO: old
router.use('/assets/:id', verifyAssetPermissionController)

// Private routes after authentication
router.delete('/logout', logoutController)
router.get('/is-authorized', isAuthorizedController)

export default router
