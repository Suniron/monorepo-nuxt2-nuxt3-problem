import { throwHTTPError } from '@/common/errors'
import { createAPIError } from '@/common/errors/api'

export const requestPassThroughService = async (
  provider,
  path,
  method,
  query,
  body,
  accessToken,
) => {
  /**
   * @type {{
   * axios: import('axios').AxiosInstance,
   * logger: any
   * }}
   */
  const { axios, logger } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { error, status, data } = await axios.request({
      // Using the concatenation syntax to preserve arguments autocompletion
      method,
      url: axios.defaults.baseURL + path,
      ...reqConfig,
      data: body,
      params: query,
    })
    if (error)
      throwHTTPError(error)

    return { data, status }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
