import {
  NOT_FOUND,
  SERVICE_ERROR,
  STORE_API_ERROR,
  UNAUTHORIZED,
  VALIDATION_ERROR,
} from '../constants'

export const createServiceError = (errorName = '', details) => {
  switch (errorName) {
    case NOT_FOUND:
    case VALIDATION_ERROR:
    case UNAUTHORIZED:
      return {
        error: details ? { details, name: errorName } : errorName,
      }
    case STORE_API_ERROR:
      return {
        error: details ? { details, name: SERVICE_ERROR } : SERVICE_ERROR,
      }
    default:
      return {
        error: details ? { details, name: errorName } : errorName,
      }
  }
}
