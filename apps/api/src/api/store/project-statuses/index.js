import { createAPIError } from '@/common/errors/api'

export const requestGetAvailableTransitions = async (
  provider,
  params,
  accessToken,
) => {
  const { axios, logger } = provider
  try {
    const { id } = params
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get(
      id
        ? `/projects/available-transitions/${id}`
        : '/projects/available-transitions',
      {
        ...reqConfig,
        params,
      },
    )
    return data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
