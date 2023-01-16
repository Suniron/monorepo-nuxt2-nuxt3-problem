import {
  NOT_FOUND,
  STORE_API_ERROR,
  UNAUTHORIZED,
  VALIDATION_ERROR,
} from '@/common/constants'

export const createAPIError = (error) => {
  const errorType = error?.response?.data?.errorType
  const errorMessage = error?.response?.data?.message

  if (errorType || errorMessage) {
    switch (errorType || errorMessage) {
      case NOT_FOUND:
      case VALIDATION_ERROR:
      case UNAUTHORIZED:
        return { error: errorType || errorMessage }
      default:
        return { error: error.response.data }
    }
  }

  return { error: STORE_API_ERROR }
}
