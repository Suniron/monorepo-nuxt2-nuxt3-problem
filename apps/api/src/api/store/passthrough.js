// @ts-check
import { createAPIError } from '@/common/errors/api'
import { log } from '@/lib/logger'

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
  const { axios } = provider
  try {
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { status, data, headers } = await axios.request({
      // Using the concatenation syntax to preserve arguments autocompletion
      method,
      url: axios.defaults.baseURL + path,
      ...reqConfig,
      data: body,
      params: query,
    })

    return { data, headers, status }
  }
  catch (error) {
    log.withError(error).error(`requestPassThroughService: ${method.toUpperCase()} ${path}`)
    return createAPIError(error)
  }
}
