import { SUCCESS, VALIDATION_ERROR } from '@/common/constants'
import { createAPIError } from '@/common/errors/api'

const getEndpoint = (id) => (id ? '/tags/' + id : '/tags')

export const requestSearchTags = async (provider, params, accessToken = '') => {
  const { axios, logger } = provider
  try {
    const { id } = params
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    // Tag by id
    if (id) return { tag: (await axios.get(getEndpoint(id), reqConfig)).data }

    // Search tags
    const queryParams = {}
    const { data } = await axios.get(getEndpoint(), {
      ...reqConfig,
      params: queryParams,
    })
    return data
  } catch (error) {
    logger.error(error)

    return createAPIError(error)
  }
}

export const requestCreateTag = async (provider, params, accessToken = '') => {
  const { axios, logger } = provider
  try {
    const { name, color } = params
    if (!name) return { error: VALIDATION_ERROR }

    const bodyPayload = { name, color }
    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }
    const { data } = await axios.post(getEndpoint(), bodyPayload, reqConfig)
    return { id: data.id }
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}

export const requestDeleteTag = async (provider, id, accessToken = '') => {
  const { axios, logger } = provider
  try {
    if (!id) return { error: VALIDATION_ERROR }

    const reqConfig = {
      ...(accessToken && {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    }

    await axios.delete(getEndpoint(id), reqConfig)
    return { status: SUCCESS }
  } catch (error) {
    logger.error(error)
    return createAPIError(error)
  }
}
