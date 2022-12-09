import { SUCCESS, VALIDATION_ERROR } from '@/common/constants'
import { createAPIError } from '@/common/errors/api'

export const requestSearchAssets = async (provider, params, accessToken) => {
  const { axios, logger } = provider
  try {
    const {
      id,
      ids,
      search,
      severities,
      tagIds,
      groupIds,
      types,
      page,
      pageSize,
    } = params
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    // Asset by id
    if (id)
      return { asset: (await axios.get(`/assets/${id}`, reqConfig)).data }

    // Search assets
    const queryParams = {
      groupIds,
      ids,
      page,
      pageSize,
      search,
      severities,
      tagIds,
      types,
    }
    const { data } = await axios.get('/assets', {
      ...reqConfig,
      params: queryParams,
    })
    return data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestCreateAsset = async (provider, params, accessToken) => {
  const { axios, logger } = provider

  try {
    const { name, type, assetData } = params
    const bodyPayload = { assetData, name, type }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    return (await axios.post('/assets', bodyPayload, reqConfig)).data
  }
  catch (error) {
    if (error.response.data.error === 'DuplicateError')
      return error.response.data
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestDeleteAsset = async (provider, id, accessToken) => {
  const { axios, logger } = provider

  try {
    if (!id)
      return { error: VALIDATION_ERROR }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    await axios.delete(`/assets/${id}`, reqConfig)
    return { status: SUCCESS }
  }
  catch (error) {
    logger.error(error)

    return createAPIError(error)
  }
}

export const requestUpdateAsset = async (provider, id, params, accessToken) => {
  const { axios, logger } = provider

  try {
    const status = SUCCESS
    if (!id)
      return { error: VALIDATION_ERROR }
    if (!params || !Object.keys(params).length)
      return { status }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    await axios.patch(`/assets/${id}`, params, reqConfig)
    return { status }
  }
  catch (error) {
    logger.error(error)

    return createAPIError(error)
  }
}

export const requestCreateAssetVulnerability = async (
  provider,
  id,
  params,
  accessToken,
) => {
  const { axios, logger } = provider
  try {
    const status = SUCCESS
    if (!id)
      return { error: VALIDATION_ERROR }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    await axios.patch(`/assets/${id}/vulnerabilities`, params, reqConfig)
    return { status }
  }
  catch (error) {
    logger.error(error)

    return createAPIError(error)
  }
}

export const requestUpdateAssetsBulk = async (
  provider,
  params,
  accessToken,
) => {
  const { axios, logger } = provider

  try {
    const status = SUCCESS
    if (!params || !Object.keys(params).length)
      return { status }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    const { data } = await axios.patch('/assets/', params, reqConfig)
    return { data }
  }
  catch (error) {
    logger.error(error)

    return createAPIError(error)
  }
}

export const requestDeleteAssetsBulk = async (
  provider,
  params,
  accessToken,
) => {
  const { axios, logger } = provider

  try {
    const status = SUCCESS
    if (!params || !Object.keys(params).length)
      return { status }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    await axios.delete('/assets/', { ...reqConfig, data: params })
    return { status }
  }
  catch (error) {
    logger.error(error)

    return createAPIError(error)
  }
}

export const requestSearchAssetVulnerabilities = async (
  provider,
  id,
  params,
  accessToken,
) => {
  const { axios, logger } = provider
  try {
    const queryParams = {
      search: params.search || undefined,
      severities: params.severities || undefined,
      type: params.type || undefined,
    }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get(`/assets/${id}/vulnerabilities`, {
      ...reqConfig,
      params: queryParams,
    })
    const { vulnerabilities, total } = data
    return { total, vulnerabilities }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateStatus = async (
  provider,
  aid,
  vid,
  params,
  accessToken,
) => {
  const { axios, logger } = provider

  try {
    const status = SUCCESS
    if (!aid || !vid)
      return { error: VALIDATION_ERROR }
    if (!params || !Object.keys(params).length)
      return { status }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    await axios.post(
      `/assets/${aid}/vulnerabilities/${vid}`,
      params,
      reqConfig,
    )
    return { status }
  }
  catch (error) {
    logger.error(error)

    return createAPIError(error)
  }
}

export const requestAddPostVulnerabilityAsset = async (
  provider,
  aid,
  vid,
  params,
  accessToken,
) => {
  const { axios, logger } = provider

  try {
    const status = SUCCESS
    if (!aid || !vid)
      return { error: VALIDATION_ERROR }
    if (!params || !Object.keys(params).length)
      return { status }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    await axios.post(
      `/assets/${aid}/vulnerabilities/${vid}/post`,
      params,
      reqConfig,
    )
    return { status }
  }
  catch (error) {
    logger.error(error)

    return createAPIError(error)
  }
}

export const requestSearchPostVulnerabilityAsset = async (
  provider,
  aid,
  vid,
  accessToken,
) => {
  const { axios, logger } = provider

  try {
    const status = SUCCESS
    if (!aid || !vid)
      return { error: VALIDATION_ERROR }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    const { data } = await axios.get(
      `/assets/${aid}/vulnerabilities/${vid}/post`,
      reqConfig,
    )
    const { comments, total } = data
    return { comments, total }
  }
  catch (error) {
    logger.error(error)

    return createAPIError(error)
  }
}

export const requestSearchAssetRevisions = async (
  provider,
  id,
  params,
  accessToken,
) => {
  const { axios, logger } = provider
  try {
    const queryParams = {
      search: params.search || undefined,
    }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get(`/assets/${id}/revisions`, {
      ...reqConfig,
      params: queryParams,
    })
    const { revisions, total } = data
    return { revisions, total }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestImportCsv = async (provider, params, accessToken) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.post('/assets/importCSV', params, reqConfig)
    return { failed: data.failed, pass: data.pass }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestFetchAssetPorts = async (
  provider,
  assetId,
  accessToken,
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get(`/assets/${assetId}/ports`, reqConfig)
    return data.details
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestSearchAssetsBelonging = async (
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
    const { data } = await axios.get('/assets/belonging', {
      ...reqConfig,
      params,
    })
    const { assets, total } = data
    return { assets, total }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestGetAssetRisk = async (provider, assetId, accessToken) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get(`/assets/${assetId}/risk`, reqConfig)

    return data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
