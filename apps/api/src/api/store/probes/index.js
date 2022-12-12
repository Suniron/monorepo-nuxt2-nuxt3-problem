import { createAPIError } from '@/common/errors/api'

export const requestSearchProbes = async (provider, params, accessToken) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get('/probes', {
      ...reqConfig,
      params,
    })
    return data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateProbes = async (
  provider,
  params,
  body,
  accessToken,
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const data = await axios.patch(`/probes/${params.id}`, body, reqConfig)
    return data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
