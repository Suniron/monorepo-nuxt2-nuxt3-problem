import { createAPIError } from '@/common/errors/api'

export const searchScansStoreAPI = async (
  provider = {},
  params = {},
  accessToken = '',
) => {
  const { axios, logger } = provider
  try {
    const { sort = '-createdAt', page, pageSize } = params
    const payload = { page, pageSize, sort }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    const { data } = await axios.get('scans', {
      ...reqConfig,
      params: payload,
    })

    const { scans, total } = data
    return { scans, total }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const scheduleWebScanStoreAPI = async (
  provider = {},
  params = {},
  accessToken = '',
) => {
  const { axios, logger } = provider
  try {
    const {
      assets = [],
      hasInternal = false,
      type = 'web',
      startDate = '',
      endDate = '',
      startTime = '',
      endTime = '',
    } = params

    // Guards
    if (!Array.isArray(assets))
      throw new Error('Param "assets" should be an array')
    if (!assets.length)
      return { id: null }

    const payload = {
      assets,
      endDate,
      endTime,
      hasInternal,
      startDate,
      startTime,
      type,
    }

    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const {
      data: { id },
    } = await axios.post('scans', payload, reqConfig)

    return { id }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const scheduleNetworkScanStoreAPI = async (
  provider = {},
  params = {},
  accessToken = '',
) => {
  const { axios, logger } = provider
  try {
    const {
      ips = [],
      credentials = [],
      hasInternal = false,
      type = 'network',
      startDate = '',
      endDate = '',
      startTime = '',
      endTime = '',
    } = params

    // Guards
    if (!Array.isArray(ips))
      throw new Error('Param "ips" should be an array')
    if (!Array.isArray(credentials))
      throw new Error('Param "credentials" should be an array')
    if (!ips.length)
      return { id: null }

    const payload = {
      credentials,
      endDate,
      endTime,
      hasInternal,
      ips,
      startDate,
      startTime,
      type,
    }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const {
      data: { id },
    } = await axios.post('scans', payload, reqConfig)

    return { id }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const scheduleScanStoreAPI = async (
  provider = {},
  params = {},
  accessToken = '',
) => {
  const { axios, logger } = provider
  try {
    const {
      hasInternal = false,
      type,
      startDate = '',
      endDate = '',
      startTime = '',
      endTime = '',
      name = '',
      probe = null,
      scanParams,
    } = params

    // Guards
    if (
      !(
        Array.isArray(scanParams.assets) || Array.isArray(scanParams.userAssets)
      )
    )
      throw new Error('Param "assets" or "userAssets" should be an array')
    if (!Array.isArray(scanParams?.credentials))
      throw new Error('Param "credentials" should be an array')
    if (!scanParams?.assets?.length && !scanParams?.userAssets?.length)
      return { id: null }

    const payload = {
      endDate,
      endTime,
      hasInternal,
      name,
      probe,
      scanParams,
      startDate,
      startTime,
      type,
    }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const {
      data: { id },
    } = await axios.post('scans', payload, reqConfig)

    return { id }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestSearchScanAssets = async (provider, accessToken = '') => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get('/scans/assets', reqConfig)
    return data.assets
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestSearchPhishingScenarios = async (
  provider,
  accessToken = '',
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get('/scans/phishing-scenarios', reqConfig)
    return data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestParseScanResult = async (
  provider,
  params,
  accessToken = '',
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.post('/scans/result', params, reqConfig)
    return data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateScan = async (
  provider,
  id,
  params,
  accessToken = '',
) => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    await axios.patch(`/scans/${id}`, params, reqConfig)
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestScanReport = async (provider, id, accessToken = '') => {
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.get(`/scans/${id}/report`, reqConfig)
    return data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
