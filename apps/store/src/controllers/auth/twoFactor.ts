import type { NextFunction, Request, Response } from 'express'
import { throwHTTPError, throwValidationError } from '../../common/errors'
import { initTotpAuthenticationModel, loginWithTotpModel } from '../../models/auth/twoFactor'
import { is2faInitialized } from '../../models/users'
import { HTTPS_ENABLED, JWT_REFRESH_DOMAIN, JWT_REFRESH_LIFE_MS, REFRESH_TOKEN_COOKIE_NAME, isProduction } from '../../config/env'

export const twoFactorSetupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as Express.User

    const { error, isInitialized } = await is2faInitialized(user.id)
    if (error)
      return throwHTTPError(error)

    // If the user has already initialized 2FA, we return a 400 error
    if (isInitialized)
      return throwValidationError({ message: '2FA already initialized' })

    // Generate a new totp seed for the user
    const { error: totpTokenError, seed, seedUrl } = await initTotpAuthenticationModel(user.id)
    if (totpTokenError)
      return throwHTTPError(totpTokenError)

    res.status(200).send({ seed, seedUrl })
  }
  catch (error) {
    next(error)
  }
}

export const loginWithTotpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as Express.User
    const { totp } = req.body as { totp: number }

    // Get fully connected tokens
    const { accessToken, refreshToken, error, message, user: loggedUser } = await loginWithTotpModel(user.id, totp)
    if (error)
      return throwHTTPError(error, message)

    // Set the refresh token in the cookies
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      domain: JWT_REFRESH_DOMAIN,
      httpOnly: true,
      maxAge: JWT_REFRESH_LIFE_MS,
      secure: isProduction && HTTPS_ENABLED,
    })

    // Return the access token
    res.status(200).send({ accessToken, user: loggedUser })
  }
  catch (error) {
    next(error)
  }
}
