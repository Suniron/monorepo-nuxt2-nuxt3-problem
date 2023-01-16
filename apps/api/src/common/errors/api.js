import {
  BAD_REQUEST,
  NOT_FOUND,
  STORE_API_ERROR,
  UNAUTHORIZED,
  VALIDATION_ERROR,
} from '@/common/constants'

export const createAPIError = (error) => {
  const errorType = error?.response?.data?.errorType
  const errorMessage = error?.response?.data?.message

  if (errorType) {
    switch (errorType) {
      case NOT_FOUND:
      case VALIDATION_ERROR:
      case UNAUTHORIZED:
      case BAD_REQUEST:
        return { error: errorType, message: errorMessage }
      default:
        return { error: error.response.data }
    }
  }

  return { error: STORE_API_ERROR }
}
