import env from '../../config/env'
/**
 * @typedef {{errorType?: string, message?: string}} ErrorParam
 */

export class HTTPError extends Error {
  code: any
  errorType: any
  /**
   *
   * @param {number} code http error code (like 2xx, 3xx, 4xx, 5xx)
   * @param {{errorType?: string, message?: string}} param1
   */
  constructor(code: any, { errorType = '', message = '' } = {}) {
    super(message)
    this.code = code
    this.message = `[${this.getDefaultMessage()}]${message && ` ${message}`}`
    this.errorType = errorType || this.getDefaultErrorType()

    this.printError()
  }

  /**
   * This method will print the error message **excepted in test environment**.
   */
  printError() {
    if (!env.nodeEnv.isTest)
      console.error(this.message)
  }

  getDefaultMessage() {
    switch (this.code) {
      case 400:
        return 'Bad request'
      case 401:
        return 'Unauthorized'
      case 403:
        return 'Forbidden'
      case 404:
        return 'Not found'
      case 406:
        return 'Not Acceptable'
      case 409:
        return 'Conflict'
      case 410:
        return 'Gone'
      case 500:
        return 'Internal server error'
      default:
        return 'Unknown Error'
    }
  }

  getDefaultErrorType() {
    const message = this.getDefaultMessage()
    return message
      .split(' ')
      .map(str => str[0].toUpperCase() + str.substr(1))
      .join('')
  }

  toJSON() {
    return {
      code: this.code,
      errorType: this.errorType,
      message: this.message,
    }
  }
}

/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getBadRequestError = ({
  errorType,
  message,
}: any = {}) =>
  new HTTPError(400, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getUnauthorizedError = ({
  errorType,
  message,
}: any = {}) =>
  new HTTPError(401, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getForbiddenError = ({
  errorType,
  message,
}: any = {}) =>
  new HTTPError(403, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getNotFoundError = ({
  errorType,
  message,
}: any = {}) =>
  new HTTPError(404, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getNotAcceptableError = ({
  errorType,
  message,
}: any = {}) =>
  new HTTPError(406, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getConflictError = ({
  errorType,
  message,
}: any = {}) =>
  new HTTPError(409, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getGoneError = ({
  errorType,
  message,
}: any = {}) =>
  new HTTPError(410, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getInternalServerError = ({
  errorType,
  message,
}: any = {}) =>
  new HTTPError(500, { errorType, message })
