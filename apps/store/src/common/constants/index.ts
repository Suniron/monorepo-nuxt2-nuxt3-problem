
import { HTTPError } from '../errors/http'

/**
 * @typedef {'ModelError' | 'ValidationError' | 'NotFound' | 'Unauthorized' | 'Forbidden' | 'SUCCESS'} HTTPStatus
 */

/**
 * Error list
 * Using getters to avoid always using the same HTTPError instance
 */

/**
 * @type {HTTPStatus}
 */
export const MODEL_ERROR = 'ModelError'

/**
 * @type {HTTPStatus}
 */
export const NOT_FOUND = 'NotFound'

/**
 * @type {HTTPStatus}
 */
export const VALIDATION_ERROR = 'ValidationError'

export const DUPLICATE = {
  get USERNAME() {
    return new HTTPError(409, {
      errorType: 'Duplicate',
      message: 'DUPLICATE.USERNAME',
    })
  },
  get MAIL() {
    return new HTTPError(409, {
      errorType: 'Duplicate',
      message: 'DUPLICATE.MAIL',
    })
  },
}

/**
 * @type {HTTPStatus}
 */
export const UNAUTHORIZED = 'Unauthorized'

/**
 * @type {HTTPStatus}
 */
export const FORBIDDEN = 'Forbidden'

// Status

/**
 * @type {HTTPStatus}
 */
export const SUCCESS = 'SUCCESS'
