import { getPhishingScenariosDomainsAPIs } from '@/api/store'
import { createServiceError } from '@/common/errors/service'
import { log } from '@/lib/logger'

export const getPhishingScenariosDomainsService = async (
  params,
  accessToken = '',
) => {
  try {
    const data = await getPhishingScenariosDomainsAPIs.getDomains(
      params,
      accessToken,
    )
    return { data }
  }
  catch (error) {
    log.withError(error).error('getPhishingScenariosDomainsService')
    return createServiceError(error)
  }
}
