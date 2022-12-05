import { VALIDATION_ERROR, SUCCESS } from '@/common/constants'
import { createAPIError } from '@/common/errors/api'
export const requestMissionAnalysisService = async (
  provider,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const { id } = params
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data, error } = await axios.get('/missions_analysis/' + id, {
      ...reqConfig,
      params,
    })
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
export const requestBusinessImpactService = async (
  provider,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data, error } = await axios.get('/business_impact', {
      ...reqConfig,
      params,
    })
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateBusinessImpactServiceIntoUnit = async (
  provider,
  query,
  body,
  accessToken
) => {
  const { axios, logger } = provider
  const { fearedEventId } = query
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    const { data } = await axios.patch(
      `/missions_analysis/${Number(fearedEventId)}/business_impact`,
      body,
      reqConfig
    )
    return { data }
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestSeveritiesService = async (
  provider,
  params,
  accessToken
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data, error } = await axios.get('/severities', {
      ...reqConfig,
      params,
    })
    return data
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateFearedEventSeverityService = async (
  provider,
  query,
  body,
  accessToken
) => {
  const { axios, logger } = provider
  const { id } = query
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    const { data } = await axios.patch(
      `/feared-events/${Number(id)}`,
      body,
      reqConfig
    )
    return { data }
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
