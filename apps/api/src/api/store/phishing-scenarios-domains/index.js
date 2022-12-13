import { createAPIError } from '@/common/errors/api'
export const getPhishingScenariosDomainsFromStore = async (
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
    const { data } = await axios.get('/phishing-scenarios-domains', {
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
