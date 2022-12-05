import { passThroughApi } from '@/api/store'
import { throwHTTPError } from '@/common/errors'
import { createServiceError } from '@/common/errors/service'
import { log } from '@/lib/logger'

export const passThroughService = async (
  path,
  method,
  query,
  body,
  accessToken
) => {
  try {
    const result = await passThroughApi.passThrough(
      path,
      method,
      query,
      body,
      accessToken
    )
    return result
  } catch (error) {
    log.withError(error).error('passThroughService')
    return createServiceError(error)
  }
}
