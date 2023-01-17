// @ts-check
import {
  getBadRequestError,
  getInternalServerError,
  getNotFoundError,
  getUnauthorizedError,
} from '@/common/errors/http'
import {
  BAD_REQUEST,
  NOT_FOUND,
  SERVICE_ERROR,
  UNAUTHORIZED,
  VALIDATION_ERROR,
} from '@/common/constants'

/**
 * Throws a 400 Bad Request error with a ValidationError type
 *
 * @throws
 * @param {{errorType?: string, message?: string }} params custom errorType or message
 */
export const throwValidationError = ({
  errorType = VALIDATION_ERROR,
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
 * Throws a 404 Not Found error with a NotFound type
 *
 * @param {{errorType?: string, message?: string }} params Custom errorType or message
 * @throws
 */
export const throwNotFoundError = ({ message } = {}) => {
  throw getNotFoundError({ message })
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
    case VALIDATION_ERROR:
      return throwValidationError({ message })
    case NOT_FOUND:
      return throwNotFoundError({ message })
    case UNAUTHORIZED:
      return throwUnauthorizedError({ message })
    case BAD_REQUEST:
      return throwBadRequestError({ message })
    case SERVICE_ERROR:
    default:
      return throwInternalServerError({ message })
  }
}
