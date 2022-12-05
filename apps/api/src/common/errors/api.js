import {
  NOT_FOUND,
  STORE_API_ERROR,
  UNAUTHORIZED,
  VALIDATION_ERROR,
} from '@/common/constants'

export const createAPIError = (error) => {
  if (error?.response?.data?.errorType) {
    switch (error.response.data.errorType) {
      case NOT_FOUND:
      case VALIDATION_ERROR:
      case UNAUTHORIZED:
        return { error: error.response.data.errorType }
      default:
        return { error: error.response.data }
    }
  }

  return { error: STORE_API_ERROR }
}
