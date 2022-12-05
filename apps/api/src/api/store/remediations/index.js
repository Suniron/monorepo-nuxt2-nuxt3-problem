import { VALIDATION_ERROR, SUCCESS } from '@/common/constants'
import { createAPIError } from '@/common/errors/api'

export const requestGroupedRemediationsService = async (
  provider,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get('/remediations/grouped', {
      ...reqConfig,
    })
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
