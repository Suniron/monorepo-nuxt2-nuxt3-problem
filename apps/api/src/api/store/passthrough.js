import { throwHTTPError } from '@/common/errors'
import { createAPIError } from '@/common/errors/api'

export const requestPassThroughService = async (
  provider,
  path,
  method,
  query,
  body,
  accessToken
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
      url: axios.defaults.baseURL + path, // Using the concatenation syntax to preserve arguments autocompletion
      method,
      ...reqConfig,
      params: query,
      data: body,
    })
    if (error) {
      throwHTTPError(error)
    }
    return { status, data }
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
