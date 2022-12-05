import { VALIDATION_ERROR, SUCCESS } from '@/common/constants'
import { createAPIError } from '@/common/errors/api'

export const requestGenerate = async (provider, accessToken) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const result = await axios.get('/reports', reqConfig)

    if (result.error) return result
    return result.data.vast
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
