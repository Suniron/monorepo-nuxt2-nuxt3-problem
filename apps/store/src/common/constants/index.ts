import { HTTPError } from '../errors/http'

export type HTTPStatus =
  | 'ModelError'
  | 'ValidationError'
  | 'NotFound'
  | 'Unauthorized'
  | 'Forbidden'
  | 'SUCCESS'

/**
 * Error list
 * Using getters to avoid always using the same HTTPError instance
 */

export const MODEL_ERROR: HTTPStatus = 'ModelError'

export const NOT_FOUND: HTTPStatus = 'NotFound'

export const VALIDATION_ERROR: HTTPStatus = 'ValidationError'

export const DUPLICATE = {
  get MAIL() {
    return new HTTPError(409, {
      errorType: 'Duplicate',
      message: 'DUPLICATE.MAIL',
    })
  },
  get USERNAME() {
    return new HTTPError(409, {
      errorType: 'Duplicate',
      message: 'DUPLICATE.USERNAME',
    })
  },
}

export const UNAUTHORIZED: HTTPStatus = 'Unauthorized'

export const FORBIDDEN: HTTPStatus = 'Forbidden'

export const SUCCESS: HTTPStatus = 'SUCCESS'
