import { probesAPIs } from '@/api/store'
import { createServiceError } from '@/common/errors/service'
import { log } from '@/lib/logger'

export const searchProbesService = async (params, accessToken = '') => {
  try {
    const data = await probesAPIs.searchProbes(params, accessToken)
    return { data }
  } catch (error) {
    log.withError(error).error('searchProbesService')
    return createServiceError(error)
  }
}
export const updateProbesService = async (params, body, accessToken = '') => {
  try {
    const data = await probesAPIs.updateProbes(params, body, accessToken)
    return data
  } catch (error) {
    log.withError(error).error('updateProbesService')
    return createServiceError(error)
  }
}
