import type { NextFunction, Request, Response } from 'express'
import type { LoggedUser } from '../../../types/user'
import { throwHTTPError, throwValidationError } from '../../common/errors'
import { is2faInitialized } from '../../models/users'

export const twoFactorSetupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as LoggedUser

    const { error, isInitialized } = await is2faInitialized(user.id)
    if (error)
      return throwHTTPError(error)

    // If the user has already initialized 2FA, we return a 400 error
    if (isInitialized) {
      throwValidationError({ message: '2FA already initialized' })
      return
    }

    // 1) Generate a secret key for the user
    // 2) Store the secret key in the database
  }
  catch (error) {
    next(error)
  }
}
