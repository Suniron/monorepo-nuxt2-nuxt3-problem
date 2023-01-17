import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../common/auth/jwt'
import { throwHTTPError, throwUnauthorizedError } from '../common/errors'

/**
 * This middleware will check the light Authentication.
 *
 * It means that the user is not fully connected. He needs to authenticate with a 2FA way.
 *
 * This check is a pre-requisite to make the strong Authentication.
 */
export const lightAuthenticationVerify = async (req: Request, _res: Response, next: NextFunction) => {
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

    // 2) Verify JWT Token validity and extract the payload
    const { payload, error, errorMessage } = verifyToken(token, 'access')
    if (error) {
      throwHTTPError(error, errorMessage)
      return
    }

    // If all is good, set user info in request and go to next middleware / controller
    req.user = payload
    next()
  }
  catch (error) {
    req.log.withError(error).error('lightAuthenticationVerify')
    next(error)
  }
}

/**
 * This middleware will check the strong Authentication.
 *
 * If this middleware is called, it means that the user is at least light authenticated.
 *
 * This middleware will check that the user is fully connected, with a 2fa way.
 *
 */
export const strongAuthenticationVerify = async (req: Request, _res: Response, next: NextFunction) => {
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

    // 2) Verify JWT Token validity and extract the payload
    const { payload, error, errorMessage } = verifyToken(token, 'access')
    if (error) {
      throwHTTPError(error, errorMessage)
      return
    }

    // 3) Verify that the user is fully connected
    if (!payload.fullyConnected) {
      throwUnauthorizedError({
        message: 'User is not fully connected, please authenticate with a 2FA way',
      })
      return
    }

    // If all is good, set user info in request and go to next middleware / controller
    req.user = payload
    next()
  }
  catch (error) {
    req.log.withError(error).error('strongAuthenticationVerify')
    next(error)
  }
}
