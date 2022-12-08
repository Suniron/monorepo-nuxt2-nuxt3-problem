// @ts-check
import {
  getBadRequestError,
  getConflictError,
  getForbiddenError,
  getInternalServerError,
  getNotFoundError,
  getUnauthorizedError,
} from '@/common/errors/http'
import {
  DUPLICATE,
  FORBIDDEN,
  MODEL_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
  VALIDATION_ERROR,
} from '@/common/constants'

/* 400 Errors */

/**
 * Throws a 400 Bad Request error with a ValidationError type
 *
 * @throws
 * @param {{errorType?: string, message?: string }} params custom errorType or message
 */
export const throwValidationError = ({
  errorType = undefined,
  message = 'Validation error',
}) => {
  throw getBadRequestError({ errorType, message })
}

/**
 * Throws a 400 Bad Request error with a BadRequest type
 *
 * @param {{errorType?: string, message?: string }} params Custom errorType or message
 * @throws
 */
export const throwBadRequestError = ({ message } = {}) => {
  throw getBadRequestError({ message })
}

/**
 * Throws a 401 Unauthorized error with a Unauthorized type
 *
 * @param {{errorType?: string, message?: string }} params Custom errorType or message
 * @throws
 */
export const throwUnauthorizedError = ({ message } = {}) => {
  throw getUnauthorizedError({ message })
}

/**
 * Throws a 403 Forbidden error with a Forbidden type
 *
 * @param {{errorType?: string, message?: string }} params Custom errorType or message
 * @throws
 */
export const throwForbiddenError = ({ message } = {}) => {
  throw getForbiddenError({ message })
}

/**
 * Throws a 404 Not Found error with a NotFound type
 *
 * @param {{errorType?: string, message?: string }} params Custom errorType or message
 * @throws
 */
export const throwNotFoundError = ({ message } = {}) => {
  throw getNotFoundError({ message })
}

/**
 * Throws a 409 Conflict error with a Duplicate error type
 *
 * @param {{errorType?: string, message?: string }} params Custom errorType or message
 * @throws
 */
export const throwDuplicateError = ({ message } = {}) => {
  throw getConflictError({ message: message ?? 'Duplicate' })
}

/**
 * Throws an 500 Internal Server Error
 *
 * @param {{errorType?: string, message?: string }} params Custom errorType or message
 * @throws
 */
export const throwInternalServerError = ({ message } = {}) => {
  throw getInternalServerError({ message })
}

/**
 * Throws an HTTP Error according the the error given
 *
 * @param {*} error Error constant that describes the error
 * @param {string=} message Custom error message
 * @throws
 */
export const throwHTTPError = (error, message) => {
  switch (error) {
    case MODEL_ERROR:
      return throwInternalServerError({ message })
    case VALIDATION_ERROR:
      return throwValidationError({ message })
    case NOT_FOUND:
      return throwNotFoundError({ message })
    case DUPLICATE:
      return throwDuplicateError({ message })
    case UNAUTHORIZED:
      return throwUnauthorizedError({ message })
    case FORBIDDEN:
      return throwForbiddenError({ message })
    default:
      return throwInternalServerError({ message })
  }
}
