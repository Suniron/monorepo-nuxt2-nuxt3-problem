import { scanAPIs } from '@/api/store'
import { createServiceError } from '@/common/errors/service'

export const scheduleScanService = async (params, accessToken = '') => {
  const {
    type,
    name,
    hasInternal = false,
    startDate,
    endDate,
    startTime,
    endTime,
    probe,
    scanParams,
  } = params

  const { id, error } = await scanAPIs.scheduleScanStoreAPI(
    {
      type,
      name,
      hasInternal,
      startDate,
      endDate,
      startTime,
      endTime,
      probe,
      scanParams,
    },
    accessToken
  )
  return error ? createServiceError(error) : { id }

  /* if (type === 'web') {
    const { assets } = params

    if (Array.isArray(assets) && assets.length) {
      const { id, error } = await scanAPIs.scheduleWebScanStoreAPI(
        {
          assets,
          hasInternal,
          type,
          startDate,
          endDate,
          startTime,
          endTime,
        },
        accessToken
      )
      return error ? createServiceError(error) : { id }
    } else {
      return { id: null }
    }
  }

  if (type === 'network') {
    const { ips, credentials } = params

    if (Array.isArray(ips) && ips.length) {
      const { id, error } = await scanAPIs.scheduleNetworkScanStoreAPI(
        {
          ips,
          credentials,
          hasInternal,
          type,
          startDate,
          endDate,
          startTime,
          endTime,
        },
        accessToken
      )
      return error ? createServiceError(error) : { id }
    } else {
      return { id: null }
    }
  }

  return createServiceError() */
}

export const searchScanAssetsService = async (accessToken = '') => {
  const data = await scanAPIs.searchScanAssets(accessToken)
  return data
}

export const searchPhishingScenariosService = async (accessToken = '') => {
  const data = await scanAPIs.searchPhishingScenarios(accessToken)
  return data
}

export default {
  scheduleScanService,
  searchScanAssetsService,
}
