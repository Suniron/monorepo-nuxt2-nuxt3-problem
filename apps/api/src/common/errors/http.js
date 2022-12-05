export class HTTPError extends Error {
  constructor(code, { errorType = '', message = '' } = {}) {
    super(message)
    this.code = code
    this.message = message || this.getDefaultMessage()
    this.errorType = errorType || this.getDefaultErrorType()
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
    }
  }

  getDefaultErrorType() {
    const message = this.getDefaultMessage()
    return message
      .split(' ')
      .map((str) => str[0].toUpperCase() + str.substr(1))
      .join('')
  }

  toJSON() {
    return {
      errorType: this.errorType,
      code: this.code,
      message: this.message,
    }
  }
}

/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getBadRequestError = ({ errorType, message } = {}) =>
  new HTTPError(400, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getUnauthorizedError = ({ errorType, message } = {}) =>
  new HTTPError(401, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getForbiddenError = ({ errorType, message } = {}) =>
  new HTTPError(403, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getNotFoundError = ({ errorType, message } = {}) =>
  new HTTPError(404, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getNotAcceptableError = ({ errorType, message } = {}) =>
  new HTTPError(406, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getConflictError = ({ errorType, message } = {}) =>
  new HTTPError(409, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getGoneError = ({ errorType, message } = {}) =>
  new HTTPError(410, { errorType, message })
/**
 *
 * @param {ErrorParam} params
 * @returns {HTTPError}
 */
export const getInternalServerError = ({ errorType, message } = {}) =>
  new HTTPError(500, { errorType, message })
