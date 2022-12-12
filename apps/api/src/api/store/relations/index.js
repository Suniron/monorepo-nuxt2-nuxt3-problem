import { createAPIError } from '@/common/errors/api'

export const requestCreateRelation = async (provider, params, accessToken) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.post('/relations', params, reqConfig)
    return { id: data.id }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestCreateBulkRelation = async (
  provider,
  params,
  accessToken,
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.post('/relations/bulk', params, reqConfig)
    return { data }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateRelation = async (
  provider,
  id,
  params,
  accessToken,
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.patch(`/relations/${id}`, params, reqConfig)
    return { id: data.id }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestDeleteRelation = async (provider, id, accessToken) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.delete(`/relations/${id}`, reqConfig)
    return { status: data.status }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestDeleteRelationByAssetsIds = async (
  provider,
  params,
  accessToken,
) => {
  const { axios, logger } = provider
  const { fromAssetId, relationType, toAssetId } = params
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.delete(
      `/relations/${fromAssetId}/${relationType}/${toAssetId}`,
      reqConfig,
    )
    return data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
