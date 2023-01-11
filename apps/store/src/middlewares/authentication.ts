import type { NextFunction, Request, Response } from 'express'
import { checkTokenValidity } from '../common/auth/jwt'
import { throwHTTPError, throwUnauthorizedError } from '../common/errors'

/**
 * This controller will check the light Authentication.
 *
 * It means that the user is not fully connected. He needs to authenticate with a 2FA way.
 *
 * This check is a pre-requisite to make the strong Authentication.
 */
export const lightAuthenticationVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) Verify JWT Token presence and format
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throwUnauthorizedError({ message: 'Authorization header not found' })
      return
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      throwUnauthorizedError({
        message: 'Cannot parse token from Authorization header',
      })
    }

    // 2) Verify JWT Token validity
    const { error: checkTokenError, tokenPayload } = await checkTokenValidity(token)
    if (checkTokenError) {
      throwHTTPError(checkTokenError)
      return
    }

    // If all is good, set user info in request and go to next middleware / controller
    req.user = tokenPayload
    next()
  }
  catch (error) {
    req.log.withError(error).error('lightAuthenticationVerify')
    next(error)
  }
}

