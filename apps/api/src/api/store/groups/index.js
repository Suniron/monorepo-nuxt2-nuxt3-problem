import { createAPIError } from '@/common/errors/api'

const getEndpoint = id => (id ? `/groups/${id}` : '/groups')
const getReqConfig = accessToken => ({
  ...(accessToken && {
    headers: { Authorization: `Bearer ${accessToken}` },
  }),
})

export const requestSearchGroups = async (
  provider,
  params,
  accessToken = '',
) => {
  const { axios, logger } = provider
  try {
    const { id } = params
    const reqConfig = getReqConfig(accessToken)

    // Group by id
    if (id)
      return { group: (await axios.get(getEndpoint(id), reqConfig)).data }

    // Search groups
    const queryParams = {}
    const { data } = await axios.get(getEndpoint(), {
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

export const requestCreateGroup = async (provider, params, accessToken) => {
  const { axios, logger } = provider
  try {
    const { name, memberIds } = params
    const bodyPayload = { memberIds, name }
    const reqConfig = getReqConfig(accessToken)

    const {
      data: { id },
    } = await axios.post(getEndpoint(), bodyPayload, reqConfig)

    return { id }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestUpdateGroup = async (
  provider,
  params,
  accessToken = '',
) => {
  const { axios, logger } = provider
  try {
    const { id, name, memberIds } = params
    const bodyPayload = { memberIds, name }
    const reqConfig = getReqConfig(accessToken)

    const { data: group } = await axios.patch(
      getEndpoint(id),
      bodyPayload,
      reqConfig,
    )

    return { group }
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
export const requestDeleteGroup = async (provider, id, accessToken = '') => {
  const { axios, logger } = provider
  try {
    const reqConfig = getReqConfig(accessToken)
    const data = await axios.delete(getEndpoint(id), reqConfig)
    return data
  }
  catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
