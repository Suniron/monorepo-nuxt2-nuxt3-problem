import { SUCCESS, VALIDATION_ERROR } from '@/common/constants'
import { createAPIError } from '@/common/errors/api'

export const requestFetchCompliance = async (
  provider,
  params,
  accessToken = ''
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get('/compliance', {
      params: params,
      ...reqConfig,
    })
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
